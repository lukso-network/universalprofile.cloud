import { Asset } from '@/models/asset'
import { AssetRepository } from '@/repositories/asset'

export const useAsset = (assetAddress?: Address, tokenId?: string) => {
  const assetRepo = useRepo(AssetRepository)
  const asset = ref<Asset>()

  watchEffect(() => {
    if (!assetAddress) {
      return
    }

    asset.value = assetRepo.getAssetAndImages(assetAddress, tokenId)
  })

  return {
    asset,
  }
}
