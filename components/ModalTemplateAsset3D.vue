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
    class="group relative flex max-h-[calc(100vh-100px)] min-h-[300px] w-full min-w-[300px] max-w-[calc(100vw-100px)] flex-col items-center justify-center rounded-12 bg-neutral-98 text-center"
  >
    <lukso-icon
      name="progress-indicator"
      class="absolute left-[calc(50%-12px)] top-[calc(50%-12px)]"
    ></lukso-icon>
    <model-viewer
      :src="modal?.data?.asset?.url"
      alt="3D model"
      auto-rotate="true"
      modelutoplay="true"
      ar="true"
      camera-controls="true"
      field-of-view="44deg"
      min-field-of-view="30deg"
      max-field-of-view="60deg"
      exposure="1"
      environment-image="neutral"
      ar-status="not-presenting"
      class="relative max-h-[calc(100vh-100px)] rounded-12"
      shadow-intensity="1"
    ></model-viewer>
    <ModalCloseButton @click="closeModal" />
  </div>
</template>
