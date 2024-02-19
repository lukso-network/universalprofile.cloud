import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type {
  LSP3ProfileMetadata,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'
import type { Image } from '@/types/image'
import type { Standard } from '@/types/contract'

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
      standard: this.attr(null),
      profileImage: this.attr(null),
      backgroundImage: this.attr(null),
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
  declare standard?: Standard
  declare profileImageId?: string
  declare backgroundImageId?: string
  declare issuedAssetAddresses?: Address[]
  declare receivedAssetAddresses?: Address[]
  declare profileImage?: Image
  declare backgroundImage?: Image
}

export type Profile = Partial<Item<ProfileModel>>

// Type of data returned from Algolia, it's not fully covered as some
// properties are irrelevant
export type IndexedProfile = {
  address: Address
  LSP3Profile?: LSP3ProfileMetadata
  profileImageUrl?: string
  LSPStandard: Standard
  type: Standard // TODO this is legacy type field, we keep it until indexer fully migrate to `LSPStandard`

  // not using now this attributes but some will be useful
  // TODO refactor this later
  hasProfileName?: boolean
  hasProfileDescription?: boolean
  hasProfileLinks?: boolean
  hasProfileTags?: boolean
  hasProfileImage?: boolean
  hasBackgroundImage?: boolean
  updatedAtBlock: number
  chainId: number
  lastUpdatedAt: string
}
