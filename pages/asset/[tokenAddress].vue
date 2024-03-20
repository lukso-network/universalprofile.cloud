<script setup lang="ts">
const tokenAddress = computed(
  () => useRouter().currentRoute.value.params?.tokenAddress
)
const asset = useAsset()(tokenAddress)

onMounted(() => {
  if (isCollectible(asset.value)) {
    navigateTo(tokenRoute(asset.value?.address as Address))
  }
})
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="!asset">
      <TokenAssetView v-if="isToken(asset)" :asset="asset" />
      <NftAssetView v-else :asset="asset" />
    </AppPageLoader>
  </div>
</template>
