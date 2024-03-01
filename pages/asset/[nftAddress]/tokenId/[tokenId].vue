<script setup lang="ts">
const address = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId
// const { asset, isLoading, isOwned } = useAsset(nftAddress, tokenId)
const asset = useAsset()(address, tokenId)
</script>

<template>
  <AppPageLoader :is-loading="!asset">
    <TokenView :asset="asset" />
  </AppPageLoader>
</template>
