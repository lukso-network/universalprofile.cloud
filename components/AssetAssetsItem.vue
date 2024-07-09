<script setup lang="ts">
type Props = {
  fileAsset?: AssetMetadata
}

defineProps<Props>()

const assetFileComponent = (asset: AssetMetadata) => {
  const assetType = getAssetType(asset)

  return {
    document: () =>
      defineAsyncComponent(
        () => import('@/components/AssetAssetsDocument.vue')
      ),
    video: () =>
      defineAsyncComponent(() => import('@/components/AssetAssetsVideo.vue')),
    audio: () =>
      defineAsyncComponent(() => import('@/components/AssetAssetsAudio.vue')),
    image: () =>
      defineAsyncComponent(() => import('@/components/AssetAssetsImage.vue')),
    '3d': () =>
      defineAsyncComponent(() => import('@/components/AssetAssets3D.vue')),
    contract: () =>
      defineAsyncComponent(
        () => import('@/components/AssetAssetsContract.vue')
      ),
    other: () =>
      defineAsyncComponent(() => import('@/components/AssetAssetsOther.vue')),
  }[assetType]()
}
</script>

<template>
  <component
    v-if="fileAsset"
    :is="assetFileComponent(fileAsset)"
    :asset="fileAsset"
  >
  </component>
</template>
