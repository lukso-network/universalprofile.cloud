<script setup lang="ts">
import type { UseQueryReturnType } from '@tanstack/vue-query'

type Props = {
  assets: UseQueryReturnType<globalThis.Asset[], Error>
}

const props = defineProps<Props>()
const { filters } = useFilters()
const assets = computed(() => props.assets.data.value || [])
const isLoadingAssets = computed(() => props.assets.isLoading.value)

const filteredAssets = computed(() => {
  return (
    assets.value
      // filter by owned/created
      .filter(asset => {
        switch (filters.assetType) {
          case 'owned':
            return asset.isOwned && hasBalance(asset) // for owned we need to check if user has balance
          case 'created':
            return asset.isIssued
          default:
            return false
        }
      })
      // filter token/collectible
      .filter(asset => {
        switch (filters.assetGroup) {
          case 'collectibles':
            return isCollectible(asset)
          case 'tokens':
            return isToken(asset)
          default:
            return false
        }
      })
  )
})
</script>

<template>
  <ProfileAssetsGraph :assets="filteredAssets" :is-loading="isLoadingAssets" />
</template>
