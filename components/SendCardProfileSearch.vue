<script setup lang="ts">
const { isGraph, isRpc } = storeToRefs(useAppStore())
</script>

<template>
  <SendCardProfileSearchGraph v-if="isGraph" />
  <SendCardProfileSearchRpc v-if="isRpc" />
</template>
