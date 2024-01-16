import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'
import type { InterfaceId } from '@/types/assets'
import type { Image } from '@/models/image'
import type { Creator } from './creator'

export class AssetModel extends BaseModel {
  static entity = 'assets'
  static primaryKey = ['address', 'tokenId']

  static fields() {
    return {
      ...super.fields(),
      address: this.attr(null),
      name: this.string(''),
      symbol: this.string(''),
      balance: this.string(''),
      decimals: this.number(0),
      tokenSupply: this.string(''),
      standard: this.string(''),
      description: this.string(''),
      links: this.attr([]),
      tokenId: this.string(''),
      tokenIdFormat: this.number(null),
      isNativeToken: this.boolean(false),
      owner: this.string(''),

      // foreign keys
      iconId: this.attr(null),
      imageIds: this.attr(null),
      creatorIds: this.attr(null),
    }
  }

  // types
  declare address: Address
  declare name?: string
  declare symbol?: string
  declare balance?: string
  declare decimals?: number
  declare tokenSupply?: string
  declare standard?: InterfaceId
  declare description?: string
  declare links?: LinkMetadata[]
  declare tokenId?: string
  declare tokenIdFormat?: number
  declare isNativeToken?: boolean
  declare owner: Address

  declare iconId?: string
  declare imageIds?: string[]
  declare creatorIds?: Address[]

  declare icon?: Image
  declare images?: Image[]
  declare creators?: Creator[]

  static piniaOptions = {
    persist: {
      key: STORAGE_KEY.ASSET_STORE,
    },
  }
}

export type Asset = Partial<Item<AssetModel>>
