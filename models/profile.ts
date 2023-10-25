import { Item, Model } from 'pinia-orm'
import { LinkMetadata } from '@lukso/lsp-factory.js'

import { ImageMetadataEncoded } from '@/types/assets'

export class ProfileModel extends Model {
  static entity = 'profiles'
  static primaryKey = 'address'

  static fields() {
    return {
      address: this.attr(null),
      name: this.string(''),
      balance: this.string(''),
      links: this.attr([]),
      tags: this.attr([]),
      description: this.string(''),
      isEoa: this.boolean(false),

      // relationships
      backgroundImage: this.hasOne(
        ImageModel,
        'profileBackgroundId',
        'address'
      ),
      profileImage: this.hasOne(ImageModel, 'profileImageId', 'address'),
      // issuedAssets: this.hasMany(AssetModel, 'issuedAssetIds', 'address'),
      // receivedAssets: this.hasMany(AssetModel, 'receivedAssetIds', 'address'),
      // assetCreatorIds: this.attr([]),
    }
  }

  // types
  declare address?: Address
  declare name?: string
  declare balance?: string
  declare links?: LinkMetadata[]
  declare tags?: string[]
  declare description?: string
  declare isEoa?: boolean
  declare backgroundImage?: ImageMetadataEncoded
  declare profileImage?: ImageMetadataEncoded
  // declare issuedAssets?: AssetModel[]
  // declare receivedAssets?: AssetModel[]

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.PROFILE_STORE,
    },
  }
}

export type ProfileItem = Item<ProfileModel>
