<script setup lang="ts">
type Props = {
  assets?: AssetMetadata[]
  fileTypes?: AssetFileType[]
}

const props = defineProps<Props>()

const filteredAssets = computed(() => {
  return props.assets?.filter(asset => {
    const assetType = getAssetType(asset)
    return props.fileTypes?.includes(assetType)
  })
})
</script>

<template>
  <slot :filtered-assets="filteredAssets" />
</template>
