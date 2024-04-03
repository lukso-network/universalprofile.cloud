<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

type Props = {
  resolvedName?: string
}

const props = defineProps<Props>()
const buttonRef = ref()
const buttonWidth = ref('auto')
const buttonFullWidth = ref('auto')
const hover = ref(false)
const isCopied = ref(false)

const handleCopy = () => {
  navigator.clipboard.writeText(link.value)
  isCopied.value = true

  setTimeout(() => {
    hover.value = false
    isCopied.value = false
  }, 500)
}

const link = computed(() => {
  return `https://m.profile.link/${props.resolvedName}`
})

onMounted(async () => {
  await nextTick()

  buttonWidth.value = '0px'
  const { width } = useElementSize(buttonRef.value)
  buttonFullWidth.value = `${width.value + 10}px`
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
        :style="{
          width: hover ? buttonFullWidth : buttonWidth,
        }"
      >
        <div class="invisible flex text-nowrap text-left group-hover:visible">
          {{ $formatMessage('share_link_copy') }}
          <div class="ml-1 text-neutral-50">
            {{ removeSchemaFromUrl(link) }}
          </div>
        </div>
      </div></lukso-button
    >
  </div>
</template>
