<script setup lang="ts">
import '@google/model-viewer'

const { modal } = useAppStore()

type Props = {
  closeModal: () => void
}
const isLoaded = ref(false)

defineProps<Props>()
const optimizedImage = useOptimizedImage(modal?.data?.asset, 500)
</script>

<template>
  <div
    class="group relative flex max-h-[calc(100vh-100px)] min-h-[300px] w-full min-w-[300px] max-w-[calc(100vw-100px)] flex-col items-center justify-center rounded-12 bg-neutral-98 text-center"
  >
    <lukso-icon
      v-if="!isLoaded"
      name="progress-indicator"
      class="absolute left-[calc(50%-12px)] top-[calc(50%-12px)]"
    ></lukso-icon>

    <AssetImage
      class="relative max-h-[calc(100vh-100px)] rounded-12"
      :src="optimizedImage"
      @on-load="isLoaded = true"
    />
    <ModalCloseButton @click="closeModal" />
  </div>
</template>
