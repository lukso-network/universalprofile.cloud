<script setup lang="ts">
import { type AbiItem, toWei } from 'web3-utils'
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'

import type { TransactionConfig } from 'web3-core'
import type { TransactionReceipt } from 'web3-eth'
import type {
  LSP7DigitalAsset,
  LSP8IdentifiableDigitalAsset,
} from '@/contracts'

const connectedProfile = useProfile().connectedProfile()
const { asset, onSend, amount, receiver, transactionHash } =
  storeToRefs(useSendStore())
const { isLoadedApp, isConnected, hasSimpleNavbar } = storeToRefs(useAppStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction, contract } = useWeb3(PROVIDERS.INJECTED)
const { currentNetwork } = storeToRefs(useAppStore())

const assetAddress = useRouter().currentRoute.value.query.asset
const tokenId = useRouter().currentRoute.value.query.tokenId
const fetchedAsset = useAsset()(assetAddress, tokenId)

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

  amount.value = undefined

  if (!fetchedAsset.value.address) {
    asset.value = {
      tokenName: currentNetwork.value.token.name,
      tokenSymbol: currentNetwork.value.token.symbol,
      isNativeToken: true,
      decimals: ASSET_LYX_DECIMALS,
    }
  } else {
    asset.value = fetchedAsset.value
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
          // TODO check if balance updates
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
          // TODO check if asset is removed
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
