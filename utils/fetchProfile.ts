import { ProfileRepository } from '@/repositories/profile'

import type { LSP3ProfileMetadata } from '@lukso/lsp-smart-contracts'
import type { NuxtApp } from '@/types/plugins'

/**
 * Put fetched profile into the store
 *
 * @param profileAddress - profile address
 */
export const fetchAndStoreProfile = async (profileAddress: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = await fetchProfile(profileAddress)

  profileRepo.saveProfile(profile)
}

/**
 * Fetch profile from the index
 *
 * @param profileAddress - profile address
 * @returns
 */
export const fetchProfile = async (profileAddress: Address) => {
  const { isLoadingProfile } = storeToRefs(useAppStore())
  const { $fetchIndexedProfile } = useNuxtApp() as unknown as NuxtApp
  const profileIndexedData = await $fetchIndexedProfile(profileAddress)

  if (!profileIndexedData || profileIndexedData.type !== 'LSP3Profile') {
    throw new NotFoundIndexError(profileAddress)
  }

  try {
    isLoadingProfile.value = true

    const profile = await createProfileObject(
      profileAddress,
      profileIndexedData?.LSP3Profile
    )

    return profile
  } catch (error: unknown) {
    throw error
  } finally {
    isLoadingProfile.value = false
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
  const { links, tags, description, name } = metadata || {}

  // links and tags are passed as object instead of array so we need to convert
  const linksParsed = links && Object.values(links)
  const tagsParsed = tags && Object.values(tags)

  // get best image from collection based on height criteria
  const profileImage =
    metadata?.profileImage &&
    createImageObject(Object.values(metadata.profileImage), 96)

  // get best image from collection based on height criteria
  const backgroundImage =
    metadata?.backgroundImage &&
    createImageObject(Object.values(metadata.backgroundImage), 240)

  // get profile LYX balance
  const { getBalance } = useWeb3(PROVIDERS.RPC)
  const balance = await getBalance(address)

  // create image identifiers so they can be linked in Pinia ORM
  const profileImageId = getHash(profileImage)
  const backgroundImageId = getHash(backgroundImage)

  return {
    address,
    name,
    balance,
    links: linksParsed,
    tags: tagsParsed,
    description,
    profileImage,
    backgroundImage,
    profileImageId,
    backgroundImageId,
  }
}
