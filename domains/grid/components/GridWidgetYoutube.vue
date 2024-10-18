<script setup lang="ts">
type Props = {
  src: string
  allow?: string
}

defineProps<Props>()
</script>

<template>
  <div class="h-full p-3">
    <iframe
      :src="src"
      :allow="allow"
      frameborder="0"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      class="size-full overflow-hidden rounded-8"
    ></iframe>
  </div>
</template>
