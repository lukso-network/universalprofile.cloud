import type { NuxtApp } from '@/types/plugins'

export const fetchAndStoreAssets = async (profileAddress: Address) => {
  const { profile } = useProfile(profileAddress)
  const assetRepo = useRepo(AssetRepository)
  const { isLoadingAssets } = storeToRefs(useAppStore())

  // combine all LSP5/12 assets into one array
  const assets = [
    ...(profile?.value?.receivedAssetAddresses || []),
    ...(profile?.value?.issuedAssetAddresses || []),
  ]

  isLoadingAssets.value = true

  const promises = assets.map(assetAddress =>
    fetchAsset(assetAddress, profileAddress).then(asset => {
      if (asset) {
        assetRepo.saveAssets(asset)
      }
    })
  )

  await Promise.all(promises)

  isLoadingAssets.value = false
}

/**
 * Fetch indexed asset and put into the store after parsing based on the type
 *
 * @param address - asset address (can be LSP7 token or LSP8 collection)
 * @param profileAddress - address of the profile
 * @param tokenIds -
 * @returns
 */
export const fetchAsset = async (
  address: Address,
  profileAddress?: Address,
  tokenIds?: string[]
) => {
  const { $fetchIndexedAsset } = useNuxtApp() as unknown as NuxtApp
  const assetIndexedData = await $fetchIndexedAsset(address)

  if (!assetIndexedData) {
    console.warn('Asset not found in the index')
    return []
  }

  // parse data based on the asset type
  switch (assetIndexedData.type) {
    case 'LSP8DigitalAsset': {
      return await createLsp8Object(
        address,
        assetIndexedData,
        profileAddress,
        tokenIds
      )
    }
    case 'LSP7DigitalAsset': {
      return [await createLsp7Object(address, assetIndexedData, profileAddress)]
    }
    case 'EOA': {
      // EOA for asset means it wasn't indexed yet
      console.warn('Asset not found in the index')
      return []
    }
    default:
      console.warn(`Asset ${address} standard is not supported`)
      return []
  }
}
