<script setup lang="ts">
const { formatMessage } = useIntl()
const deepLink = ref('')
const { initProvider, connect, deepLinkParser } = useWalletConnect()
const { walletConnectProvider: provider } = storeToRefs(useAppStore())

onMounted(async () => {
  await initProvider()
  provider.value?.on('display_uri', (data: string) => {
    deepLink.value = deepLinkParser(data)
  })

  try {
    await connect()
  } catch (error) {
    console.warn(error)
  }
})
</script>

<template>
  <lukso-button variant="secondary" is-full-width is-link :href="deepLink">
    <lukso-icon name="phone-portrait-outline" class="mr-2"></lukso-icon>
    {{
      formatMessage(
        'modal_connect_wallet_select_provider_connect_mobile_button'
      )
    }}
  </lukso-button>
</template>
