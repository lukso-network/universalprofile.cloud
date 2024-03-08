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
    class="relative flex max-h-[calc(100vh-100px)] min-h-[200px] w-full min-w-[400px] max-w-[calc(100vw-100px)] flex-col items-center justify-center rounded-12 bg-neutral-98 text-center"
  >
    <lukso-icon
      name="progress-indicator"
      class="absolute left-[calc(50%-12px)] top-[calc(50%-12px)]"
    ></lukso-icon>
    <audio controls class="relative max-h-[calc(100vh-100px)] rounded-12">
      <source :src="modal?.data?.asset?.url" />
    </audio>
    <lukso-icon
      name="close-lg"
      class="absolute right-6 top-6 z-[1] cursor-pointer rounded-full bg-neutral-98 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
      @click="closeModal"
    ></lukso-icon>
  </div>
</template>
