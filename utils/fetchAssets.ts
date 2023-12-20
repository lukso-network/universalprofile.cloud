import { AssetRepository } from '@/repositories/asset'

export const fetchAssets = async (profileAddress: Address) => {
  const { profile } = useProfile(profileAddress)
  const assetRepo = useRepo(AssetRepository)
  const { receivedAssetAddresses, issuedAssetAddresses } = profile.value || {}
  const { isLoadingAssets } = storeToRefs(useAppStore())

  try {
    isLoadingAssets.value = true

    receivedAssetAddresses &&
      (await assetRepo.loadAssets(receivedAssetAddresses, profileAddress))
    issuedAssetAddresses &&
      (await assetRepo.loadAssets(issuedAssetAddresses, profileAddress))
  } catch (error) {
    console.error(error)
  } finally {
    isLoadingAssets.value = false
  }
}
