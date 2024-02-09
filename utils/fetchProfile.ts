import LSP3ProfileMetadataSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { toChecksumAddress } from 'web3-utils'

import { ProfileRepository } from '@/repositories/profile'

import type { LSP3ProfileMetadata } from '@lukso/lsp-smart-contracts'
import type { NuxtApp } from '@/types/plugins'
import type { ERC725JSONSchema } from '@erc725/erc725.js'

/**
 * Put fetched profile into the store
 *
 * @param profileAddress - profile address
 */
export const fetchAndStoreProfile = async (profileAddress: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = await fetchProfile(profileAddress)

  profileRepo.saveProfile(profile)

  return profile
}

/**
 * Fetch profile from the index
 *
 * @param profileAddress - profile address
 * @returns
 */
export const fetchProfile = async (profileAddress: Address) => {
  const checksumProfileAddress = toChecksumAddress(profileAddress)
  assertAddress(checksumProfileAddress)

  const { $fetchIndexedProfile } = useNuxtApp() as unknown as NuxtApp
  const profileIndexedData = await $fetchIndexedProfile(profileAddress)

  if (!profileIndexedData || profileIndexedData.type !== PROFILE_TYPES.LSP3) {
    throw new NotFoundIndexError(profileAddress)
  }

  try {
    const profile = await createProfileObject(
      profileAddress,
      profileIndexedData?.LSP3Profile
    )

    return profile
  } catch (error: unknown) {
    throw error
  }
}

/**
 * Create Profile type object
 *
 * @param profileAddress - address of the profile
 * @param profileMetadata - metadata of the profile
 * @returns
 */
const createProfileObject = async (
  address: Address,
  metadata?: LSP3ProfileMetadata
): Promise<Profile> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    address,
    LSP3ProfileMetadataSchema as ERC725JSONSchema[]
  )
  const { links, tags, description, name } = metadata || {}

  // get best image from collection based on height criteria

  const profileImage =
    metadata?.profileImage && createImageObject(metadata.profileImage, 96)

  // get best image from collection based on height criteria
  const backgroundImage = Array.isArray(metadata?.backgroundImage)
    ? createImageObject(metadata.backgroundImage, 240)
    : undefined

  // get profile LYX balance
  const { getBalance } = useWeb3(PROVIDERS.RPC)
  const balance = await getBalance(address)

  // create image identifiers so they can be linked in Pinia ORM
  const profileImageId = getHash(profileImage?.url)
  const backgroundImageId = getHash(backgroundImage?.url)

  let receivedAssetAddresses: Address[] = []
  let issuedAssetAddresses: Address[] = []
  try {
    // get received assets array for profile
    // TODO update this when Algolia provides LSP5 array for the profile
    const assetAddresses = await erc725.fetchData([
      'LSP5ReceivedAssets[]',
      'LSP12IssuedAssets[]',
    ])
    const [receivedAssets, issuedAssets] = assetAddresses

    assertArray(receivedAssets?.value)
    assertAddresses(receivedAssets?.value)
    receivedAssetAddresses = receivedAssets?.value
    assertArray(issuedAssets?.value)
    assertAddresses(issuedAssets?.value)
    issuedAssetAddresses = issuedAssets?.value
  } catch (error) {}

  return {
    address,
    name,
    balance,
    links,
    tags,
    description,
    profileImage,
    backgroundImage,
    profileImageId,
    backgroundImageId,
    receivedAssetAddresses,
    issuedAssetAddresses,
  }
}
