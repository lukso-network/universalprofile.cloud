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
    class="relative flex w-full flex-col items-center justify-center rounded-12 bg-neutral-98 text-center"
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
      class="relative size-full rounded-12"
      shadow-intensity="1"
    ></model-viewer>
    <lukso-icon
      name="close-lg"
      class="absolute right-6 top-6 z-[1] cursor-pointer rounded-full bg-neutral-98 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
      @click="closeModal"
    ></lukso-icon>
  </div>
</template>
