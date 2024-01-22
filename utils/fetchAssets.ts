import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'

import type { ERC725JSONSchema } from '@erc725/erc725.js'
import type { NuxtApp } from '@/types/plugins'

export const fetchAndStoreAssets = async (profileAddress: Address) => {
  const { profile } = useProfile(profileAddress)
  const profileRepo = useRepo(ProfileRepository)
  const assetRepo = useRepo(AssetRepository)
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const { isLoadingAssets } = storeToRefs(useAppStore())

  // we split LSP5 and LSP12 into separate catch blocks so we can handle them individually and even if
  // one fails, the other is still handled.
  isLoadingAssets.value = true

  try {
    // TODO update this when Algolia provides LSP5 array for the profile
    const receivedAssets = (await erc725.fetchData('LSP5ReceivedAssets[]'))
      ?.value
    assertArray(receivedAssets)
    assertAddresses(receivedAssets)

    // get assets an put into store
    await Promise.all(
      receivedAssets.map(async assetAddress => {
        const assets = await fetchAsset(assetAddress, profileAddress)
        assets && assets.length && assetRepo.saveAssets(assets)
      })
    )

    // update profile store with received assets array
    profileRepo.saveProfile({
      ...profile.value,
      receivedAssetAddresses: receivedAssets,
    })
  } catch (error) {
    console.error(error)
  }

  try {
    // TODO update this when Algolia provides LSP12 array for the profile
    const issuedAssets = (await erc725.fetchData('LSP12IssuedAssets[]'))?.value
    assertArray(issuedAssets)
    assertAddresses(issuedAssets)

    // get assets an put into store
    await Promise.all(
      issuedAssets.map(async assetAddress => {
        const assets = await fetchAsset(assetAddress, profileAddress)
        assets && assets.length && assetRepo.saveAssets(assets)
      })
    )

    // update profile store with issued assets array
    profileRepo.saveProfile({
      ...profile.value,
      issuedAssetAddresses: issuedAssets,
    })
  } catch (error) {
    console.error(error)
  }

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
      // TODO rework to Algolia
      return await fetchLsp8Assets(address, profileAddress, tokenIds)
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
