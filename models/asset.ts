import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type {
  LSP4DigitalAssetMetadata,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'
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
  declare standard?: AssetType
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
}

export type Asset = Partial<Item<AssetModel>>

export type AssetType = 'EOA' | 'LSP7DigitalAsset' | 'LSP8DigitalAsset'

export const TOKEN_STANDARDS: AssetType[] = ['LSP7DigitalAsset']
export const NFT_STANDARDS: AssetType[] = ['LSP8DigitalAsset']

export const StandardsAbbreviations: { [K in AssetType]?: string } = {
  LSP7DigitalAsset: 'LSP7',
  LSP8DigitalAsset: 'LSP8',
}

export type IndexedAsset = {
  address: Address
  type: AssetType
  name?: string
  symbol?: string
  LSP4Metadata?: LSP4DigitalAssetMetadata

  // not using now this attributes but some will be useful in FE
  // TODO refactor this later
  hasTokenName?: boolean
  hasTokenSymbol?: boolean
  hasAssetImage?: boolean
  hasIconImage?: boolean
  lastUpdatedAt?: string
}
