import { Repository } from 'pinia-orm'

import { type Creator, CreatorModel } from '@/models/creator'

export class CreatorRepository extends Repository<CreatorModel> {
  getAssetCreators(assetAddress?: Address, tokenId?: string): Creator[] {
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!assetAddress) {
      return []
    }

    return this.repo(CreatorModel)
      .where('assetId', assetAddress)
      .where('tokenId', tokenId)
      .where('chainId', selectedChainId.value)
      .get()
  }

  getCreator(
    creatorAddress: Address,
    assetAddress?: Address,
    tokenId?: string
  ): Creator {
    const { selectedChainId } = storeToRefs(useAppStore())
    const primaryKey = this.primaryKey(creatorAddress, assetAddress, tokenId)
    const creatorProfile =
      this.repo(ProfileRepository).getProfileAndImages(creatorAddress)
    const creator = this.repo(CreatorModel)
      .where('chainId', selectedChainId.value)
      .find(primaryKey)

    return {
      ...creator,
      profile: creatorProfile,
    } as Creator
  }

  saveCreators(creators: Creator[]) {
    // save creators
    this.repo(CreatorModel).save(creators)

    // save creator profiles
    const creatorProfiles = creators?.map(creator => creator?.profile)
    creatorProfiles &&
      creatorProfiles.length &&
      creatorProfiles.forEach(creatorProfile => {
        this.repo(ProfileRepository).saveProfile(creatorProfile)
      })
  }

  private primaryKey(
    creatorAddress: Address,
    assetAddress?: Address,
    tokenId = ''
  ) {
    return `["${creatorAddress}","${assetAddress}","${tokenId}"]`
  }
}
