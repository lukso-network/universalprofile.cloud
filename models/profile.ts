import { Item, Model } from 'pinia-orm'
import { LSP3Profile, LinkMetadata } from '@lukso/lsp-factory.js'

import { ImageModel } from '@/models/image'

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
      backgroundImage: this.attr(null),
      profileImage: this.attr(null),
      // issuedAssets: this.hasMany(AssetModel, 'issuedAssetsId', 'address'),
      // receivedAssets: this.hasMany(AssetModel, 'receivedAssetIds', 'address'),

      // foreign keys
      // assetCreatorIds: this.attr([]),
      issuedAssetIds: this.attr(null),
      receivedAssetIds: this.attr(null),
      modelType: this.string(''),
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
  declare backgroundImage?: string
  declare profileImage?: string
  // declare issuedAssets?: AssetItem[]
  // declare receivedAssets?: AssetItem[]
  // declare assetCreatorIds?: Address[]
  declare receivedAssetIds?: Address[]
  declare issuedAssetIds?: Address[]
  declare modelType?: string

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.PROFILE_STORE,
    },
  }
}

export type ProfileItem = Item<ProfileModel>
export type ProfileWithImagesItem = ProfileItem & {
  profileImage?: Item<ImageModel>
  backgroundImage?: Item<ImageModel>
}

export type IndexedProfile = {
  address: Address
  profileURL?: string
  profileHash?: string
  profileHashFunction?: string
  LSP3Profile?: LSP3Profile
  hasProfileName?: boolean
  hasProfileDescription?: boolean
  backgroundImageUrl?: string
  hasBackgroundImage?: boolean
  profileImageUrl?: string
  hasProfileImage?: boolean
  updatedAtBlock: number
  network: string
  objectID: string
}
