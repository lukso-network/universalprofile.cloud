<script setup lang="ts">
type Props = {
  title?: string
  text?: string
  backgroundColor?: string
  titleColor?: string
  textColor?: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="m-3 flex h-full flex-col items-center justify-center overflow-hidden rounded-8 p-4 text-neutral-100"
    :style="{ backgroundColor }"
  >
    <h1
      class="heading-apax-24-medium break-word"
      :style="{
        color: titleColor,
      }"
    >
      {{ title }}
    </h1>
    <p
      class="mt-2 whitespace-pre-line text-center text-16 break-word"
      :style="{
        color: textColor,
      }"
    >
      {{ text }}
    </p>
  </div>
</template>
