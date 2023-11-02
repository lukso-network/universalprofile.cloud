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
}
