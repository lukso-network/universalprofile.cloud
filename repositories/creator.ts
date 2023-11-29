import { Repository } from 'pinia-orm'

import { Creator, CreatorModel } from '@/models/creator'

export class CreatorRepository extends Repository<CreatorModel> {
  getAssetCreators(assetAddress?: Address, tokenId?: string): Creator[] {
    const { selectedChainId } = storeToRefs(useAppStore())

    if (!assetAddress) {
      return []
    }

    if (tokenId) {
      return this.repo(CreatorModel)
        .where('assetId', assetAddress)
        .where('tokenId', tokenId)
        .where('chainId', selectedChainId.value)
        .get()
    } else {
      return this.repo(CreatorModel)
        .where('assetId', assetAddress)
        .where('chainId', selectedChainId.value)
        .get()
    }
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

  private primaryKey(
    creatorAddress: Address,
    assetAddress?: Address,
    tokenId = ''
  ) {
    return `["${creatorAddress}","${assetAddress}","${tokenId}"]`
  }
}
