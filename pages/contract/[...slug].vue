<script setup lang="ts">
import { watch } from 'vue'

const [assetAddress, tokenId] =
  useRouter().currentRoute.value.params?.slug || []

const asset = useAsset()(assetAddress, tokenId)

watch(
  () => asset.value,
  asset => {
    if (!asset || asset.isLoading) {
      return
    }
    // anything that is not LSP7/8 we open in explorer
    if (!isAsset(asset)) {
      return window.open(explorerContractUrl(asset.address), '_blank')
    }

    if (isCollectible(asset) && asset?.tokenId) {
      navigateTo(nftRoute(asset.address, asset.tokenId))
    } else {
      navigateTo(tokenRoute(asset.address))
    }
  }
)
</script>

<template>
  <div class="relative">
    <AppPageLoader :is-loading="true" />
  </div>
</template>
