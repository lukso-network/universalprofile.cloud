<script setup lang="ts">
const { isGraph, isRpc } = storeToRefs(useAppStore())
</script>

<template>
  <ProfileShowcaseGraph v-if="isGraph" />
  <ProfileShowcaseRpc v-if="isRpc" />
</template>
