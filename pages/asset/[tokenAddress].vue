<script setup lang="ts">
const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const asset = useAsset()(tokenAddress)

onMounted(() => {
  if (isCollectible(asset.value)) {
    navigateTo(nftRoute(asset.value?.address, '0x'))
  }
})
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="!asset">
      <TokenAssetView :asset="asset" />
    </AppPageLoader>
  </div>
</template>
