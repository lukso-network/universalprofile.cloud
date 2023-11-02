import { Item } from 'pinia-orm'
import { LSP3ProfileMetadata, LinkMetadata } from '@lukso/lsp-smart-contracts'

import { Image } from '@/models/image'
import { BaseModel } from '@/models/base'

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

      // foreign keys
      profileImageId: this.attr(null),
      backgroundImageId: this.attr(null),
      issuedAssetIds: this.attr(null),
      receivedAssetIds: this.attr(null),
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

  declare profileImageId?: string
  declare backgroundImageId?: string
  declare issuedAssetIds?: Address[]
  declare receivedAssetIds?: Address[]

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
