import { useViewedProfile } from './useViewedProfile'
import { AssetRepository } from '@/repositories/asset'

import type { Asset } from '@/models/asset'

export const useAsset = (assetAddress?: Address, tokenId?: string) => {
  const assetRepo = useRepo(AssetRepository)
  const asset = ref<Asset>()
  const { isLoadingAssets, isLoadedApp } = storeToRefs(useAppStore())
  const { viewedProfile } = useViewedProfile()

  watchEffect(async () => {
    if (!assetAddress || !isLoadedApp.value) {
      return
    }

    let storeAsset = assetRepo.getAssetAndImages(assetAddress, tokenId)

    // when we access asset details page directly, then asset might be not loaded
    if (!storeAsset) {
      let fetchedAsset: Asset[]
      isLoadingAssets.value = true

      if (tokenId) {
        fetchedAsset = await fetchAsset(
          assetAddress,
          viewedProfile.value?.address,
          [tokenId]
        )
      } else {
        fetchedAsset = await fetchAsset(
          assetAddress,
          viewedProfile.value?.address
        )
      }

      fetchedAsset && fetchedAsset.length && assetRepo.saveAssets(fetchedAsset)
      storeAsset = assetRepo.getAssetAndImages(assetAddress, tokenId)

      try {
      } catch (error) {
        console.error(error)
      } finally {
        isLoadingAssets.value = false
      }
    }

    asset.value = storeAsset
  })

  return {
    asset,
  }
}
