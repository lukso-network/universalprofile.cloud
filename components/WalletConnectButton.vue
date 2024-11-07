<script setup lang="ts">
const { formatMessage } = useIntl()
const deepLink = ref('')
const { initProvider, connect: connectWalletConnect } =
  useWalletConnectProvider()
const { walletConnectProvider: provider } = storeToRefs(useAppStore())
const { closeModal } = useModal()

const handleClick = async () => {
  await closeModal()
  navigateTo(deepLink.value, { external: true })
}

onMounted(async () => {
  await initProvider()
  provider.value?.on('display_uri', (data: string) => {
    deepLink.value = walletConnectDeepLinkUrl(data, {
      withRedirectUrl: true,
    })
  })

  try {
    await connectWalletConnect()
  } catch (error) {
    console.warn(error)
  }
})
</script>

<template>
  <lukso-button
    variant="secondary"
    is-full-width
    target="_self"
    :is-loading="!deepLink ? true : undefined"
    :loading-text="
      formatMessage(
        'modal_connect_wallet_select_provider_connect_mobile_button'
      )
    "
    :disabled="!deepLink ? true : undefined"
    @click="handleClick"
  >
    <lukso-icon name="phone-portrait-outline" class="mr-2"></lukso-icon>
    {{
      formatMessage(
        'modal_connect_wallet_select_provider_connect_mobile_button'
      )
    }}
  </lukso-button>
</template>
