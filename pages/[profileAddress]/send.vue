<script setup lang="ts">
import { AbiItem, toWei } from 'web3-utils'
import { TransactionConfig } from 'web3-core'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'

import { PROVIDERS } from '@/types/enums'
import {
  LSP7DigitalAsset,
  LSP8IdentifiableDigitalAsset,
} from '@/types/contracts'

const { profile: connectedProfile, status } = useConnectedProfileStore()
const {
  profile: viewedProfile,
  setBalance,
  removeNft,
} = useViewedProfileStore()
const { ownedAssets } = storeToRefs(useViewedProfileStore())
const { currentNetwork } = useAppStore()
const { asset, onSend, amount, receiver } = storeToRefs(useSendStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction, getBalance, contract } = useWeb3(PROVIDERS.INJECTED)

onMounted(() => {
  setStatus('draft')

  onSend.value = handleSend

  // for nft's we prefill amount
  if (isNft(asset.value)) {
    amount.value = '1'
  }
})

onUnmounted(() => {
  setStatus('draft')
  clearSend()
})

watchEffect(() => {
  // until everything is loaded we skip this effect
  if (!status.isProfileLoaded) {
    return
  }

  try {
    amount.value = undefined
    const assetAddress = useRouter().currentRoute.value.query.asset
    assertAddress(assetAddress, 'asset')
    asset.value = ownedAssets.value?.find(
      asset => asset.address === assetAddress
    )
    assertAddress(asset.value?.address, 'asset')
  } catch (error) {
    // fallback to native token
    asset.value = {
      name: currentNetwork.token.name,
      symbol: currentNetwork.token.symbol,
      icon: ASSET_LYX_ICON_URL,
      isNativeToken: true,
    }
  }

  // since balance is not avail in onMounted hook
  asset.value = {
    ...asset.value,
    amount: isLyx(asset.value) ? connectedProfile.balance : asset.value.amount,
  }

  // when logout
  if (!status.isConnected) {
    navigateTo(homeRoute())
  }
})

const handleSend = async () => {
  try {
    setStatus('pending')

    // native token transfer
    if (isLyx(asset.value)) {
      const transaction = {
        from: connectedProfile.address,
        to: receiver.value?.address as unknown as string,
        value: toWei(amount.value || '0'),
      } as TransactionConfig

      await sendTransaction(transaction)
      await updateLyxBalance()
    } else {
      // custom token transfer
      switch (asset.value?.standard) {
        case 'LSP7DigitalAsset':
          const tokenContract = contract<LSP7DigitalAsset>(
            LSP7Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.address)
          assertAddress(receiver.value?.address)
          await tokenContract.methods
            .transfer(
              connectedProfile.address,
              receiver.value?.address,
              toWei(amount.value || '0'),
              false,
              '0x'
            )
            .send({ from: connectedProfile.address })
          const balance = (await tokenContract.methods
            .balanceOf(connectedProfile.address)
            .call()) as string
          assertAddress(asset.value?.address, 'asset')
          setBalance(asset.value.address, balance)
          break
        case 'LSP8IdentifiableDigitalAsset':
          const nftContract = contract<LSP8IdentifiableDigitalAsset>(
            LSP8Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.address)
          assertAddress(receiver.value?.address)
          assertString(asset.value.tokenId)
          await nftContract.methods
            .transfer(
              connectedProfile.address,
              receiver.value?.address,
              asset.value.tokenId,
              false,
              '0x'
            )
            .send({ from: connectedProfile.address })
          assertNotUndefined(asset.value.address, 'asset')
          removeNft(asset.value.address, asset.value.tokenId)
          break
        default:
          console.error('Unknown token type')
          break
      }
    }

    setStatus('success')
  } catch (error: any) {
    console.error(error)
    setStatus('draft')

    // errors that have a code or message
    if (error && error.code) {
      switch (error.code) {
        case 4001:
          return showModal({
            title: formatMessage('send_error_title'),
            message: formatMessage('send_error_rejected_request'),
          })
        default:
          showModal({
            title: formatMessage('send_error_title'),
            message: formatMessage('send_error_message'),
          })
      }
    }

    // unknowns errors
    showModal({
      title: formatMessage('send_error_title'),
      message: formatMessage('send_error_message'),
    })
  }
}

const updateLyxBalance = async () => {
  assertString(connectedProfile.address)
  connectedProfile.balance = await getBalance(connectedProfile.address)

  if (viewedProfile.address === connectedProfile.address) {
    viewedProfile.balance = connectedProfile.balance
  }
}
</script>

<template>
  <SendCard />
</template>
