import { Item, Model } from 'pinia-orm'

import { Profile } from '@/models/profile'
import { Asset } from '@/models/asset'

export class CreatorModel extends Model {
  static entity = 'creators'
  static primaryKey = ['profileId', 'assetId', 'tokenId']

  static fields() {
    return {
      isVerified: this.attr(false),

      // foreign keys
      profileId: this.attr(null),
      assetId: this.attr(null),
      tokenId: this.attr(null),
    }
  }

  // types
  declare isVerified?: boolean

  declare profileId?: Address
  declare assetId?: Address
  declare tokenId?: string

  declare profile?: Profile
  declare asset?: Asset

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.CREATOR_STORE,
    },
  }
}

export type Creator = Partial<Item<CreatorModel>>
