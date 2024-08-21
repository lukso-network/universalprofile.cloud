<script setup lang="ts">
defineProps<{
  title: string
  src?: string
  textColor?: string
  bgColor?: string
}>()
</script>

<template>
  <div
    :class="
      'flex h-full items-center justify-center overflow-hidden rounded-[10px] p-4 text-neutral-100 ' +
      textColor +
      ' ' +
      bgColor
    "
  >
    <a :href="src" target="_blank">
      <h1 class="heading-apax-48-bold">{{ title }}</h1>
    </a>
  </div>
</template>
