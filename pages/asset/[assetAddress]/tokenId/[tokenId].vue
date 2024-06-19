<script setup lang="ts">
const address = useRouter().currentRoute.value.params?.assetAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId
const asset = useAsset()(address, tokenId)
</script>

<template>
  <AppPageLoader :is-loading="!asset">
    <NftAssetView :asset="asset" />
  </AppPageLoader>
</template>
