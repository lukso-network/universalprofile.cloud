import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type {
  LSP4DigitalAssetMetadata,
  LinkMetadata,
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
} from '@lukso/lsp-smart-contracts'
import type { Image } from '@/models/image'
import type { Creator } from '@/models/creator'

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
      tokenType: this.string(''),
      assetImageUrl: this.string(''),

      // foreign keys
      iconId: this.attr(null),
      imageIds: this.attr(null),
      creatorIds: this.attr(null),
    }
  }

  static mutators() {
    return {
      tokenType(value: TokenType) {
        return value.toUpperCase() // Since indexer return mixed case we unify with mutator
      },
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
  declare tokenType?: TokenType
  declare assetImageUrl?: string

  // foreign keys

  declare iconId?: string
  declare imageIds?: string[]
  declare creatorIds?: Address[]

  declare icon?: Image
  declare images?: Image[]
  declare creators?: Creator[]
}

export type Asset = Partial<Item<AssetModel>>

export type AssetType = 'EOA' | 'LSP7DigitalAsset' | 'LSP8DigitalAsset'
export type TokenType = keyof typeof LSP4_TOKEN_TYPES
export type TokenIdFormatKey = keyof typeof LSP8_TOKEN_ID_FORMAT
export type TokenIdFormatValue = (typeof LSP8_TOKEN_ID_FORMAT)[TokenIdFormatKey]

export const StandardsAbbreviations: { [K in AssetType]?: string } = {
  LSP7DigitalAsset: 'LSP7',
  LSP8DigitalAsset: 'LSP8',
}

export type IndexedAsset = {
  address: Address
  type: AssetType
  name?: string
  description?: string
  symbol?: string
  LSP4Metadata?: LSP4DigitalAssetMetadata
  TokenType?: TokenType // TODO change to camelcase when fixed in indexer
  assetImageUrl?: string

  // not using now this attributes but some will be useful in FE
  // TODO refactor this later
  hasTokenName?: boolean
  hasTokenSymbol?: boolean
  hasAssetImage?: boolean
  hasIconImage?: boolean
  hasTokenType?: boolean
  lastUpdatedAt?: string
}
