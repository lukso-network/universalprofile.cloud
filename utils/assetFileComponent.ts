/**
 * Resolve the file asset component based on the type
 *
 * @param asset
 * @returns
 */
export const assetFileComponent = (asset: AssetMetadata) => {
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
