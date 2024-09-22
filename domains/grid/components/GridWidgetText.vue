<script setup lang="ts">
type Props = {
  title?: string
  text?: string
  bgColor?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="m-3 flex h-full flex-col items-center justify-center overflow-hidden rounded-12 p-4 text-neutral-100"
    :style="{ backgroundColor: bgColor }"
  >
    <h1 class="heading-apax-24-medium">{{ title }}</h1>
    <p class="mt-2 text-center text-16">{{ text }}</p>
  </div>
</template>
