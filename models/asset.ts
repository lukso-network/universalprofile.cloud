import { Item } from 'pinia-orm'
import { ImageMetadata, LinkMetadata } from '@lukso/lsp-smart-contracts'

import { InterfaceId } from '@/types/assets'
import { Image } from '@/models/image'
import { BaseModel } from '@/models/base'
import { Creator } from './creator'

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
      tokenIdType: this.number(null),
      isNativeToken: this.boolean(false),
      hash: this.string(''),
      verification: this.attr({}),

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
  declare tokenIdType?: number
  declare isNativeToken?: boolean
  declare hash: string
  declare verification?: ImageMetadata['verification']

  declare iconId?: string
  declare imageIds?: string[]

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
