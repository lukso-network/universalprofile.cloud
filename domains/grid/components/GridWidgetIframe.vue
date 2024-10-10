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
      class="size-full overflow-hidden rounded-12"
      frameborder="0"
      loading="lazy"
    ></iframe>
  </div>
</template>
