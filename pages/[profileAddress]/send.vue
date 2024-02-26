<script setup lang="ts">
import { type AbiItem, toWei } from 'web3-utils'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'

import { AssetRepository } from '@/repositories/asset'

import type { TransactionConfig } from 'web3-core'
import type { TransactionReceipt } from 'web3-eth'
import type {
  LSP7DigitalAsset,
  LSP8IdentifiableDigitalAsset,
} from '@/types/contracts'

const { connectedProfile } = useConnectedProfile()
const { currentNetwork } = useAppStore()
const { asset, onSend, amount, receiver, transactionHash } =
  storeToRefs(useSendStore())
const { isLoadedApp, isConnected, hasSimpleNavbar } = storeToRefs(useAppStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction, contract } = useWeb3(PROVIDERS.INJECTED)
const assetRepository = useRepo(AssetRepository)

onMounted(() => {
  setStatus('draft')

  onSend.value = handleSend

  // for nft's we prefill amount
  if (isCollectible(asset.value)) {
    amount.value = '1'
  }
})

onUnmounted(() => {
  setStatus('draft')
  hasSimpleNavbar.value = false
  clearSend()
})

watchEffect(() => {
  // until everything is loaded we skip this effect
  if (!isLoadedApp.value) {
    return
  }

  try {
    amount.value = undefined
    const assetAddress = useRouter().currentRoute.value.query.asset
    const tokenId = useRouter().currentRoute.value.query.tokenId
    assertAddress(assetAddress, 'asset')
    const storeAsset = assetRepository.getAsset(assetAddress, tokenId)

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

  // when not connected then navigate to home
  if (!isConnected.value) {
    navigateTo(homeRoute())
  }
})

const handleSend = async () => {
  await checkExtensionNetwork()

  try {
    setStatus('pending')
    hasSimpleNavbar.value = true
    let transactionsReceipt: TransactionReceipt

    // native token transfer
    if (isLyx(asset.value)) {
      const transaction = {
        from: connectedProfile.value?.address,
        to: receiver.value?.address as unknown as string,
        value: toWei(amount.value || '0'),
      } as TransactionConfig
      transactionsReceipt = await sendTransaction(transaction)
      transactionHash.value = transactionsReceipt.transactionHash
      await updateLyxBalance(connectedProfile.value?.address)
    } else {
      // custom token transfer
      switch (asset.value?.standard) {
        case STANDARDS.LSP7:
          const tokenContract = contract<LSP7DigitalAsset>(
            LSP7Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          transactionsReceipt = await tokenContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              toWeiWithDecimals(amount.value || '0', asset.value?.decimals),
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          transactionHash.value = transactionsReceipt.transactionHash
          const balance = (await tokenContract.methods
            .balanceOf(connectedProfile.value.address)
            .call()) as string
          assertAddress(asset.value?.address, 'asset')
          assetRepository.setBalance(asset.value.address, balance)

          break
        case STANDARDS.LSP8:
          const nftContract = contract<LSP8IdentifiableDigitalAsset>(
            LSP8Mintable.abi as AbiItem[],
            asset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          assertString(asset.value.tokenId)
          transactionsReceipt = await nftContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              asset.value.tokenId,
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          transactionHash.value = transactionsReceipt.transactionHash
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
    hasSimpleNavbar.value = false

    showModal({
      title: formatMessage('web3_connect_error_title'),
      message: getErrorMessage(error),
    })
  }
}
</script>

<template>
  <AppPageLoader>
    <SendCard />
  </AppPageLoader>
</template>
