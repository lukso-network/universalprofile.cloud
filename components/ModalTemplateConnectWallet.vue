<script setup lang="ts">
const { closeModal } = useModal()
const { formatMessage } = useIntl()
const { isUniversalProfileExtension, connect: connectBrowserExtension } =
  useBrowserExtensionProvider()
const { isMobile } = useDevice()
const { isConnecting } = storeToRefs(useAppStore())
const isWalletConnect = ref(false)

const handleConnectBrowser = async () => {
  // if not supported browser
  if (!browserSupportExtension.value) {
    return console.warn('Browser not supported')
  }

  // extension not installed then link to store
  if (!isUniversalProfileExtension) {
    return window.open(extensionStore.value.url, '_blank')
  }

  await connectBrowserExtension()
}

const handleToggleMobile = () => {
  isWalletConnect.value = !isWalletConnect.value
}

const extensionStore = computed(() => {
  const url = browserInfo().storeLink
  const icon = `logo-${browserInfo().id}`

  return {
    icon,
    url,
  }
})

const browserSupportExtension = computed(() => extensionStore.value.url !== '')
</script>

<template>
  <div
    class="relative flex max-w-full flex-col rounded-12 bg-neutral-98 p-6 sm:max-w-[420px]"
  >
    <div class="flex justify-between">
      <ModalBackButton v-if="isWalletConnect" @click="handleToggleMobile" />
      <div v-else></div>
      <ModalCloseButton @click="closeModal" />
    </div>

    <!-- Select provider -->
    <div v-if="!isWalletConnect" class="flex flex-col items-center text-center">
      <img src="/images/app-icon.png" alt="" class="mb-6 w-12" />
      <div class="heading-inter-21-semi-bold mb-4">
        {{ formatMessage('modal_connect_wallet_select_provider_title') }}
      </div>
      <div class="paragraph-inter-16-regular mb-6">
        {{ formatMessage('modal_connect_wallet_select_provider_text') }}
      </div>
      <div
        :class="{
          'flex-col-reverse': isMobile,
          'flex-col': !isMobile,
        }"
        class="flex gap-2"
      >
        <lukso-button
          variant="secondary"
          is-full-width
          :disabled="!browserSupportExtension || isMobile ? true : undefined"
          :is-loading="isConnecting ? true : undefined"
          :loading-text="
            formatMessage(
              'modal_connect_wallet_select_provider_connect_extension_button'
            )
          "
          @click="handleConnectBrowser"
        >
          <lukso-icon
            :name="extensionStore.icon"
            class="mr-2"
            secondary-color="neutral-100"
          ></lukso-icon>
          {{
            formatMessage(
              'modal_connect_wallet_select_provider_connect_extension_button'
            )
          }}
        </lukso-button>
        <WalletConnectButton v-if="false" />
        <lukso-button
          variant="secondary"
          is-full-width
          disabled
          @click="handleToggleMobile"
        >
          <lukso-icon name="phone-portrait-outline" class="mr-2"></lukso-icon>
          {{
            formatMessage(
              'modal_connect_wallet_select_provider_connect_mobile_button'
            )
          }}
          (soon)
        </lukso-button>
      </div>
      <div class="paragraph-inter-12-regular mt-4 text-neutral-40">
        {{ formatMessage('modal_connect_wallet_select_provider_install_info') }}
      </div>
    </div>

    <!-- Wallet Connect QR code -->
    <div v-if="isWalletConnect" class="text-center">
      <div class="heading-inter-21-semi-bold mb-4">
        {{ formatMessage('modal_connect_wallet_mobile_scan_title') }}
      </div>
      <div class="paragraph-inter-16-regular mb-6">
        {{ formatMessage('modal_connect_wallet_mobile_scan_text') }}
      </div>
      <WalletConnectQrCode
        class="flex items-center justify-center pb-6 pt-4"
        @disconnect="handleToggleMobile"
      />
    </div>
  </div>
</template>
