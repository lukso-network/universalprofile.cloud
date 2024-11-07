<script setup lang="ts">
import { useDebounceFn, useResizeObserver } from '@vueuse/core'

type Props = {
  src: string
  allow?: string
  referrerpolicy?: IframeReferrerPolicy
  allowfullscreen?: boolean
  widget?: GridWidget
}

const props = defineProps<Props>()
const embedSrc = ref(props.src)
const iframeRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)

const handleLoad = () => {
  isLoaded.value = true
}

const reloadIframe = () => {
  embedSrc.value = ''
  const onResize = useDebounceFn(() => {
    embedSrc.value = props.src
  }, 100)
  onResize()
}

watch(
  () => props.src,
  () => {
    reloadIframe()
  }
)

useResizeObserver(iframeRef, useDebounceFn(reloadIframe, 100))
</script>

<template>
  <div ref="iframeRef" class="relative h-full p-3">
    <AppLoader
      v-if="!isLoaded"
      class="absolute left-[calc(50%-20px)] top-[calc(50%-20px)]"
    />
    <iframe
      :src="embedSrc"
      :allow="allow"
      :referrerpolicy="referrerpolicy"
      :allowfullscreen="allowfullscreen"
      frameborder="0"
      class="size-full overflow-hidden rounded-8"
      @load="handleLoad"
    >
    </iframe>
  </div>
</template>
