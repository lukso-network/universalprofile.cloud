import { isAddress, toChecksumAddress } from 'web3-utils'

import type { Profile } from '@/models/profile'
import type { Creator } from '@/models/creator'

export const fetchLsp4Creators = async (
  assetAddress: Address,
  creatorAddresses?: Address[],
  tokenId?: string,
  ownerAddress?: string
) => {
  try {
    const creators: Creator[] = []
    const cleanupCreatorAddresses = creatorAddresses?.filter(Boolean) || []

    // if no creators set we fallback to contract owner
    if (!cleanupCreatorAddresses.length) {
      const creatorObject = await createCreatorObject(
        ownerAddress,
        assetAddress,
        tokenId
      )
      creators.push(creatorObject)
    } else {
      for (let i = 1; i <= cleanupCreatorAddresses.length; i++) {
        const creatorObject = await createCreatorObject(
          cleanupCreatorAddresses[i - 1],
          assetAddress,
          tokenId
        )

        creators.push(creatorObject)
      }
    }

    return creators
  } catch (error) {
    console.error(error)
    return []
  }
}

const createCreatorObject = async (
  creatorAddress?: string,
  assetAddress?: Address,
  tokenId?: string
): Promise<Creator> => {
  assertAddress(creatorAddress)
  assertAddress(assetAddress)

  let profile: Profile = {
    address: toChecksumAddress(creatorAddress) as Address,
  }

  try {
    // TODO rework thi to get creators from Algolia index
    profile = {
      ...(await fetchProfile(creatorAddress)),
      ...profile,
    }
  } catch (error) {
    console.warn(`Failed to fetch creator ${creatorAddress}`)
  }
  const issuedAssets =
    (profile?.issuedAssetAddresses &&
      profile.issuedAssetAddresses.filter(address => {
        if (isAddress(address)) {
          return address
        }
      })) ||
    []
  const isVerified = issuedAssets.includes(assetAddress)

  return {
    profileId: toChecksumAddress(creatorAddress) as Address,
    profile,
    assetId: assetAddress,
    tokenId,
    isVerified,
  }
}
