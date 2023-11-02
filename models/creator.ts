import { Item } from 'pinia-orm'

import { Profile } from '@/models/profile'
import { Asset } from '@/models/asset'
import { BaseModel } from '@/models/base'

export class CreatorModel extends BaseModel {
  static entity = 'creators'
  static primaryKey = ['profileId', 'assetId', 'tokenId']

  static fields() {
    return {
      ...super.fields(),
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
