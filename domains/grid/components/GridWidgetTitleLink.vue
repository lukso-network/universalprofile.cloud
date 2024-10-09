<script setup lang="ts">
type Props = {
  title: string
  src?: string
  textColor?: string
  backgroundColor?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="m-3 flex h-full items-center justify-center overflow-hidden rounded-12 p-4 text-neutral-100"
    :style="{ backgroundColor, color: textColor }"
  >
    <a :href="src" target="_blank">
      <h1 class="heading-apax-48-bold">{{ title }}</h1>
    </a>
  </div>
</template>
