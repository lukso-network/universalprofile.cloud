<script setup lang="ts">
type Props = {
  id: string
}

defineProps<Props>()
</script>

<template>
  <script src="https://static.elfsight.com/platform/platform.js" async></script>
  <div :class="`elfsight-app-${id}`" data-elfsight-app-lazy></div>
</template>
