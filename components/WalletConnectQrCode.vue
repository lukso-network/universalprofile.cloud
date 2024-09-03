<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'

import { useWalletConnect } from '@/composables/useWalletConnect'

type Emits = (event: 'disconnect') => void

const emit = defineEmits<Emits>()

const qrCodeElement = ref<HTMLDivElement | null>(null)
const { isMobile } = useDevice()
const { initProvider, connect } = useWalletConnect()
const isLoading = ref(true)
const qrCodeDeepLink = ref('')
const { walletConnectProvider: provider } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()

const size = computed(() => (isMobile ? 300 : 340))

const generateQrCode = (data: string) => {
  qrCodeDeepLink.value = data
  const qrCode = new QRCodeStyling({
    width: size.value,
    height: size.value,
    type: 'svg',
    data,
    image: '/images/app-icon.png',
    dotsOptions: {
      color: '#243542',
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#f8fafb',
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 10,
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
    },
  })

  if (qrCodeElement.value) {
    qrCode.append(qrCodeElement.value as HTMLDivElement)
  }
}

onMounted(async () => {
  await initProvider()
  provider.value?.on('display_uri', generateQrCode)
  isLoading.value = false

  try {
    await connect()
  } catch (error) {
    console.error(error)
    emit('disconnect')
  }
})
</script>

<template>
  <div>
    <lukso-tooltip
      variant="light"
      offset="0"
      is-clipboard-copy
      :copy-text="formatMessage('asset_address_copied_tooltip')"
      :copy-value="qrCodeDeepLink"
    >
      <div
        ref="qrCodeElement"
        :style="{
          'min-height': `${size}px`,
        }"
      ></div>
    </lukso-tooltip>
    <AppLoader v-if="isLoading" />
  </div>
</template>
