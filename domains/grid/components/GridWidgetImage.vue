<script setup lang="ts">
type Props = {
  src?: string
}

defineProps<Props>()
</script>

<template>
  <div class="m-3 flex h-full overflow-hidden rounded-8">
    <img
      class="min-h-full min-w-full shrink-0 object-cover"
      :src="src"
      alt="image"
    />
  </div>
</template>
