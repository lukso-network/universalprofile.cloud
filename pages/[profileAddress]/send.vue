<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { toWei } from 'web3-utils'
import { TransactionConfig } from 'web3-core'

import { PROVIDERS } from '@/types/enums'

const { profile: connectedProfile, status } = useConnectedProfileStore()
const { profile: viewedProfile } = useViewedProfileStore()
const { currentNetwork } = useAppStore()
const { asset, onSend, amount, receiver } = storeToRefs(useSendStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction, getBalance } = useWeb3(PROVIDERS.INJECTED)

onMounted(() => {
  setStatus('draft')
  clearSend()

  asset.value = {
    name: 'LUKSO',
    symbol: currentNetwork.token.symbol,
    icon: ASSET_LYX_ICON_URL,
  }

  onSend.value = handleSend
})

watchEffect(() => {
  if (!asset.value) {
    return
  }

  // since balance is not avail in onMounted hook
  asset.value = {
    ...asset.value,
    amount: connectedProfile.balance,
  }

  if (!status.isConnected) {
    navigateTo(homeRoute())
  }
})

const handleSend = async () => {
  try {
    setStatus('pending')

    let transaction = {
      from: connectedProfile.address,
      to: receiver.value?.address as unknown as string,
      value: toWei(amount.value || '0'),
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    } as TransactionConfig
    console.log(transaction)

    await sendTransaction(transaction)
    await updateBalance()
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
          return showModal({
            title: formatMessage('send_error_title'),
            message: error.message,
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

const updateBalance = async () => {
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
