import { useViewedProfile } from './useViewedProfile'
import { Asset } from '@/models/asset'
import { AssetRepository } from '@/repositories/asset'

export const useAsset = (assetAddress?: Address, tokenId?: string) => {
  const assetRepo = useRepo(AssetRepository)
  const asset = ref<Asset>()
  const { isLoadingAssets } = storeToRefs(useAppStore())
  const { viewedProfile } = useViewedProfile()

  watchEffect(async () => {
    if (!assetAddress) {
      return
    }

    let storeAsset = assetRepo.getAssetAndImages(assetAddress, tokenId)

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
