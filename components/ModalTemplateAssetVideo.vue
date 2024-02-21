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
    <video class="relative rounded-12" autoplay>
      <source :src="modal?.data?.asset?.url" />
    </video>
    <lukso-icon
      name="close-lg"
      class="absolute right-6 top-6 z-[1] cursor-pointer rounded-full bg-neutral-98 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
      @click="closeModal"
    ></lukso-icon>
  </div>
</template>
