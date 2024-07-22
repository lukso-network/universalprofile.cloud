<script setup lang="ts">
const { isGraph, isRpc } = storeToRefs(useAppStore())
</script>

<template>
  <AppNavbarProfileSearchGraph v-if="isGraph" />
  <AppNavbarProfileSearchRpc v-if="isRpc" />
</template>
