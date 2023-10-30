import { Repository } from 'pinia-orm'

import { Creator, CreatorModel } from '@/models/creator'

export class CreatorRepository extends Repository<CreatorModel> {
  getAssetCreators(assetAddress?: Address, tokenId?: string): Creator[] {
    if (!assetAddress) {
      return []
    }

    if (tokenId) {
      return this.repo(CreatorModel)
        .where('assetId', assetAddress)
        .where('tokenId', tokenId)
        .get()
    } else {
      return this.repo(CreatorModel).where('assetId', assetAddress).get()
    }
  }
}
