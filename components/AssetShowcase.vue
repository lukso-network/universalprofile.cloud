<script setup lang="ts">
const { isGraph } = storeToRefs(useAppStore())
</script>

<template>
  <AssetShowcaseGraph v-if="isGraph" />
</template>
