<script setup lang="ts">
type Props = {
  assets: AssetMetadata[]
}

defineProps<Props>()

const assetFileType = (asset: AssetMetadata) => {
  const assetType = getAssetType(asset)

  return {
    ['document']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsDocument.vue`)),
    ['video']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsVideo.vue`)),
    ['audio']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsAudio.vue`)),
    ['image']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsImage.vue`)),
    ['3d']: () => defineAsyncComponent(() => import(`./AssetAssets3D.vue`)),
    ['contract']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsContract.vue`)),
    ['other']: () =>
      defineAsyncComponent(() => import(`./AssetAssetsOther.vue`)),
  }[assetType]()
}
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_assets') }}
    </div>
    <div class="flex flex-wrap gap-4">
      <component
        v-for="(asset, index) in assets"
        :key="index"
        :is="assetFileType(asset)"
        :asset="asset"
      >
      </component>
    </div>
  </div>
</template>
