<script setup lang="ts">
const { isRpc, isGraph } = storeToRefs(useAppStore())
</script>

<template>
  <ProfileViewRpc v-if="isRpc" />
  <ProfileViewGraph v-if="isGraph" />
</template>
