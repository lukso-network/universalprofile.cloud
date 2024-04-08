<script setup lang="ts">
// import { useElementSize } from '@vueuse/core'

type Props = {
  profile?: Profile
}

const props = defineProps<Props>()
const isCopied = ref(false)
const isCopying = ref(false)
const { currentNetwork } = storeToRefs(useAppStore())
const expandedRef = ref<HTMLDivElement>()
const copyRef = ref<HTMLDivElement>()
const expandedWidth = ref(0)
const copyWidth = ref(0)
const buttonWidth = ref('auto')

const handleCopy = async () => {
  isCopying.value = true
  navigator.clipboard.writeText(linkUrl.value)
  isCopied.value = true
  buttonWidth.value = `${copyWidth.value}px` // set width to copy text
  await sleep(500)
  buttonWidth.value = '0px'
  isCopying.value = false
}

// if we keep cursor on button after copy we can re-open with click
const handleAfterCopy = () => {
  isCopied.value = false
  isCopying.value = false
}

const handleMouseOver = () => {
  if (isCopied.value) {
    return
  }

  buttonWidth.value = `${expandedWidth.value}px`
  copyRef.value?.classList.add('hidden')
}

const handleMouseLeave = () => {
  if (isCopying.value) {
    return
  }

  isCopied.value = false
  buttonWidth.value = '0px'
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

onMounted(async () => {
  // we need slight delay to make sure that the elements are rendered before we can get their width
  await sleep(100)
  expandedWidth.value = expandedRef.value?.clientWidth || 0
  copyWidth.value = copyRef.value?.clientWidth || 0

  copyRef.value?.classList.add('hidden') // after we measure copy text we hide it
  buttonWidth.value = '0px' // also collapse button
})
</script>

<template>
  <div
    class="absolute right-4 top-4"
    @mouseover="handleMouseOver"
    @mouseleave="handleMouseLeave"
  >
    <lukso-button
      v-if="isCopied"
      size="small"
      variant="secondary"
      custom-class="px-0 overflow-hidden"
      @click="handleAfterCopy"
      ><lukso-icon
        size="small"
        name="transaction-send"
        class="mx-1.5"
      ></lukso-icon>
      <div
        class="paragraph-inter-12-medium transition-width duration-500 ease-out"
        :style="{
          width: buttonWidth,
        }"
      >
        <div class="mr-1.5 inline-flex">
          {{ $formatMessage('share_link_copied') }}
        </div>
      </div></lukso-button
    >
    <lukso-button
      v-else
      size="small"
      variant="secondary"
      custom-class="px-0 overflow-hidden"
      @click="handleCopy"
      ><lukso-icon
        size="small"
        name="transaction-send"
        class="mx-1.5"
      ></lukso-icon>
      <div
        class="paragraph-inter-12-medium transition-width duration-500 ease-out"
        :style="{
          width: buttonWidth,
        }"
      >
        <div ref="expandedRef" class="inline-flex items-center text-nowrap">
          {{ $formatMessage('share_link_copy') }}
          <div class="m-1 mr-1.5 text-neutral-50">
            {{ removeSchemaFromUrl(linkLabel) }}
          </div>
        </div>
        <div ref="copyRef" class="inline-flex">
          <div class="mr-1.5">
            {{ $formatMessage('share_link_copied') }}
          </div>
        </div>
      </div></lukso-button
    >
  </div>
</template>
