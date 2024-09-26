<script setup lang="ts">
type Props = {
  src: string
}

defineProps<Props>()
</script>

<template>
  <div class="h-full p-3">
    <iframe
      :src="src"
      class="size-full overflow-hidden rounded-12"
      frameborder="0"
    ></iframe>
  </div>
</template>
