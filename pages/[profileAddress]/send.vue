<script setup lang="ts">
import { AbiItem, toWei } from 'web3-utils'
import { TransactionConfig } from 'web3-core'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'

import {
  LSP7DigitalAsset,
  LSP8IdentifiableDigitalAsset,
} from '@/types/contracts'
import { AssetRepository } from '@/repositories/asset'

const { connectedProfile } = useConnectedProfile()
const { currentNetwork } = useAppStore()
const { asset, onSend, amount, receiver } = storeToRefs(useSendStore())
const { isLoadedApp, isConnected } = storeToRefs(useAppStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction, contract } = useWeb3(PROVIDERS.INJECTED)
const assetRepository = useRepo(AssetRepository)

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
  if (!isLoadedApp) {
    return
  }

  try {
    amount.value = undefined
    const assetAddress = useRouter().currentRoute.value.query.asset
    const tokenId = useRouter().currentRoute.value.query.tokenId
    assertAddress(assetAddress, 'asset')
    const storeAsset = assetRepository.getAssetAndImages(assetAddress, tokenId)

    if (!storeAsset) {
      assertAddress(connectedProfile.value?.address, 'profile')
      navigateTo(sendRoute(connectedProfile.value?.address))
    } else {
      asset.value = storeAsset
    }
  } catch (error) {
    // fallback to native token
    asset.value = {
      name: currentNetwork.token.name,
      symbol: currentNetwork.token.symbol,
      isNativeToken: true,
      decimals: ASSET_LYX_DECIMALS,
    }
  }

  // since balance is not avail in onMounted hook
  asset.value = {
    ...asset.value,
    balance: isLyx(asset.value)
      ? connectedProfile.value?.balance
      : asset.value?.balance,
  }

  // when logout
  if (!isConnected) {
    navigateTo(homeRoute())
  }
})

const handleSend = async () => {
  try {
    setStatus('pending')

    // native token transfer
    if (isLyx(asset.value)) {
      const transaction = {
        from: connectedProfile.value?.address,
        to: receiver.value?.address as unknown as string,
        value: toWei(amount.value || '0'),
      } as TransactionConfig

      await sendTransaction(transaction)
      await updateLyxBalance(connectedProfile.value?.address)
    } else {
      // custom token transfer
      switch (asset.value?.standard) {
        case 'LSP7DigitalAsset':
          const tokenContract = contract<LSP7DigitalAsset>(
            LSP7Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          await tokenContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              toWei(amount.value || '0'),
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          const balance = (await tokenContract.methods
            .balanceOf(connectedProfile.value.address)
            .call()) as string
          assertAddress(asset.value?.address, 'asset')
          assetRepository.setBalance(asset.value.address, balance)

          break
        case 'LSP8IdentifiableDigitalAsset':
          const nftContract = contract<LSP8IdentifiableDigitalAsset>(
            LSP8Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          assertString(asset.value.tokenId)
          await nftContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              asset.value.tokenId,
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          assertNotUndefined(asset.value.address, 'asset')
          assetRepository.removeAsset(asset.value.address, asset.value.tokenId)
          break
        default:
          console.error('Unknown token type')
          break
      }
    }

    setStatus('success')
  } catch (error: unknown) {
    console.error(error)
    setStatus('draft')

    await checkNetwork()

    showModal({
      title: formatMessage('web3_connect_error_title'),
      message: getErrorMessage(error),
    })
  }
}
</script>

<template>
  <SendCard />
</template>
