<script setup lang="ts">
const assetAddress = computed(
  () => useRouter().currentRoute.value.params?.assetAddress
)
const asset = useAsset()(assetAddress.value)

onMounted(() => {
  if (isCollectible(asset.value)) {
    navigateTo(assetRoute(asset.value?.address as Address))
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
