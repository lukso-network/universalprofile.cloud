<script setup lang="ts">
type Props = {
  src: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex h-full overflow-hidden rounded-[10px]">
    <img
      class="min-h-full min-w-full shrink-0 object-cover"
      :src="src"
      alt="image"
    />
  </div>
</template>
