import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type {
  ImageMetadata,
  LSP3ProfileMetadata,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'
import type { Image } from '@/models/image'

export class ProfileModel extends BaseModel {
  static entity = 'profiles'
  static primaryKey = 'address'

  static fields() {
    return {
      ...super.fields(),
      address: this.attr(null),
      name: this.string(''),
      balance: this.string(''),
      links: this.attr([]),
      tags: this.attr([]),
      description: this.string(''),
      isEoa: this.boolean(false),
      hash: this.string(''),
      verification: this.attr({}),

      // foreign keys
      profileImageId: this.attr(null),
      backgroundImageId: this.attr(null),
      issuedAssetAddresses: this.attr(null),
      receivedAssetAddresses: this.attr(null),
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
  declare hash: string
  declare verification?: ImageMetadata['verification']

  declare profileImageId?: string
  declare backgroundImageId?: string
  declare issuedAssetAddresses?: Address[]
  declare receivedAssetAddresses?: Address[]

  declare profileImage?: Image
  declare backgroundImage?: Image

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.PROFILE_STORE,
    },
  }
}

export type Profile = Partial<Item<ProfileModel>>

export type IndexedProfile = {
  address: Address
  profileURL?: string
  profileHash?: string
  profileHashFunction?: string
  LSP3Profile?: LSP3ProfileMetadata
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
