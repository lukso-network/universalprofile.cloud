import type { IndexedAsset } from '@/models/asset'
import type { ContractType } from '@/types/contract'
import type { NuxtApp } from '@/types/plugins'

/**
 * Fetch assets and put into the store
 *
 * @param profileAddress
 * @returns
 */
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
 * @param tokenIds - token ids for LSP8 token
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
    console.warn(`Asset ${address} not found in the index`)
    return []
  }

  return await getAssetForStandard(
    assetIndexedData.LSPStandard,
    address,
    assetIndexedData,
    profileAddress,
    tokenIds
  )
}

/**
 * Get asset for given standard
 *
 * @param standard
 * @param address
 * @param assetIndexedData
 * @param profileAddress
 * @param tokenIds
 * @returns
 */
const getAssetForStandard = async (
  standard: ContractType,
  address: Address,
  assetIndexedData: IndexedAsset,
  profileAddress?: Address,
  tokenIds?: string[]
): Promise<Asset[]> => {
  switch (standard) {
    case ASSET_TYPES.LSP8: {
      return await createLsp8Object(
        address,
        assetIndexedData,
        profileAddress,
        tokenIds
      )
    }
    case ASSET_TYPES.LSP7: {
      return [await createLsp7Object(address, assetIndexedData, profileAddress)]
    }
    case ASSET_TYPES.EOA: {
      // EOA for asset means it wasn't indexed yet
      console.warn(`Asset ${address} not found in the index`)
      return []
    }
    case ASSET_TYPES.UNKNOWN:
    // pass to default check
    default: {
      // for unknown type we do additional RPC check and run getAsset again
      console.warn(
        `Asset ${address} standard is unknown, fallback to RPC check`
      )
      const standard = await detectStandard(address)

      switch (standard) {
        case ASSET_TYPES.LSP8: {
          return await getAssetForStandard(
            ASSET_TYPES.LSP8,
            address,
            assetIndexedData,
            profileAddress,
            tokenIds
          )
        }
        case ASSET_TYPES.LSP7: {
          return await getAssetForStandard(
            ASSET_TYPES.LSP7,
            address,
            assetIndexedData,
            profileAddress,
            tokenIds
          )
        }
        default: {
          console.warn(`Asset ${address} standard is not supported`)
          return []
        }
      }
    }
  }
}
