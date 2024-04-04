<script setup lang="ts">
type Props = {
  profile?: Profile
}

const props = defineProps<Props>()
const buttonRef = ref()
const buttonWidth = ref('auto')
const hover = ref(false)
const isCopied = ref(false)
const { currentNetwork } = storeToRefs(useAppStore())

const handleCopy = () => {
  navigator.clipboard.writeText(linkUrl.value)
  isCopied.value = true

  setTimeout(() => {
    hover.value = false
    isCopied.value = false
  }, 500)
}

const linkUrl = computed(() => {
  if (props.profile?.profileLink?.isResolved) {
    return props.profile?.profileLink?.link || ''
  }

  // if we can't resolve we just link to the wallet
  return `${BASE_WALLET_URL}/${props.profile?.address}/?network=${currentNetwork.value.id}`
})

const linkLabel = computed(() => {
  if (props.profile?.profileLink?.isResolved) {
    return props.profile?.profileLink?.link || ''
  }

  // non resolved links we show as just an address
  return props.profile?.address
})

// const buttonSize = useElementSize(buttonRef)

// const buttonFullWidth = computed(() => `${buttonSize.width.value + 10}px`)

onMounted(async () => {
  await nextTick()

  buttonWidth.value = '0px'
})
</script>

<template>
  <div v-if="isCopied" class="absolute right-4 top-4">
    <lukso-button
      size="small"
      variant="secondary"
      class="group"
      custom-class="px-0 overflow-hidden"
      @click="handleCopy"
      ><lukso-icon name="link-1" size="small" class="mx-1.5"></lukso-icon>
      <div
        class="paragraph-inter-12-medium pl-1 pr-3 transition-all duration-500 ease-out"
      >
        {{ $formatMessage('share_link_copied') }}
      </div></lukso-button
    >
  </div>
  <div
    v-else
    class="absolute right-4 top-4"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <lukso-button
      size="small"
      variant="secondary"
      class="group"
      custom-class="px-0 overflow-hidden"
      @click="handleCopy"
      ><lukso-icon name="link-1" size="small" class="mx-1.5"></lukso-icon>
      <div
        ref="buttonRef"
        class="paragraph-inter-12-medium transition-all duration-500 ease-out"
      >
        <div
          class="flex w-0 items-center text-nowrap text-left group-hover:w-full"
        >
          {{ $formatMessage('share_link_copy') }}
          <div class="m-1 mr-1.5 text-neutral-50">
            {{ removeSchemaFromUrl(linkLabel) }}
          </div>
        </div>
      </div></lukso-button
    >
  </div>
</template>
