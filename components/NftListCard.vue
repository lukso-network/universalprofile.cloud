<script setup lang="ts">
type Props = {
  asset: Asset
}

defineProps<Props>()
const { isRpc, isGraph } = storeToRefs(useAppStore())
</script>

<template>
  <NftListCardGraph v-if="isGraph" :asset="asset" />
  <NftListCardRpc v-if="isRpc" :asset="asset" />
</template>
