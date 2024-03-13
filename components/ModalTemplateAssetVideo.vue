<script setup lang="ts">
import '@google/model-viewer'

const { modal } = useAppStore()

type Props = {
  closeModal: () => void
}

defineProps<Props>()
</script>

<template>
  <div
    class="relative flex max-h-[calc(100vh-100px)] min-h-[300px] w-full min-w-[300px] max-w-[calc(100vw-100px)] flex-col items-center justify-center rounded-12 bg-neutral-98 text-center"
  >
    <lukso-icon
      name="progress-indicator"
      class="absolute left-[calc(50%-12px)] top-[calc(50%-12px)]"
    ></lukso-icon>
    <video class="relative max-h-[calc(100vh-100px)] rounded-12" autoplay loop>
      <source :src="modal?.data?.asset?.src" />
    </video>
    <ModalCloseButton @click="closeModal" />
  </div>
</template>
