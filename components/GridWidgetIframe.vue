<script setup lang="ts">
type Props = {
  src: string
  title: string
  allow: string
}

defineProps<Props>()
</script>

<template>
  <iframe
    :src="src"
    :title="title"
    :allow="allow"
    class="overflow-hidden rounded-[10px]"
    width="100%"
    height="100%"
    frameborder="0"
  ></iframe>
</template>
