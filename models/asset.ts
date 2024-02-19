import { BaseModel } from '@/models/base'

import type { Item } from 'pinia-orm'
import type {
  LSP4DigitalAssetMetadata,
  LinkMetadata,
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
} from '@lukso/lsp-smart-contracts'
import type { Image } from '@/types/image'
import type { Standard } from '@/types/contract'

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
      contractOwner: this.string(''),
      creators: this.attr(null),
      icon: this.attr(null),
      images: this.attr(null),
      attributes: this.attr(null),
      assets: this.attr(null),
    }
  }

  // types
  declare address: Address
  declare name?: string
  declare symbol?: string
  declare balance?: string
  declare decimals?: number
  declare tokenSupply?: string
  declare standard?: Standard
  declare description?: string
  declare links?: LinkMetadata[]
  declare tokenId?: string
  declare tokenIdFormat?: number
  declare isNativeToken?: boolean
  declare owner: Address
  declare tokenType?: TokenType
  declare contractOwner?: Address
  declare creators?: Address[]
  declare icon?: Image
  declare images?: Image[]
  declare attributes: AttributeMetadata[]
  declare assets?: AssetMetadata[]
}

export type Asset = Partial<Item<AssetModel>>

export type TokenType = keyof typeof LSP4_TOKEN_TYPES
export type TokenIdFormatKey = keyof typeof LSP8_TOKEN_ID_FORMAT
export type TokenIdFormatValue = (typeof LSP8_TOKEN_ID_FORMAT)[TokenIdFormatKey]

export type IndexedAsset = {
  address: Address
  LSPStandard: Standard
  LSP4TokenName?: string
  LSP4TokenSymbol?: string
  description?: string
  LSP4Metadata?: LSP4DigitalAssetMetadata
  LSP4TokenType?: TokenType
  LSP4Creators?: Address[]

  // not using now this attributes but some will be useful in FE
  // TODO refactor this later
  hasTokenName?: boolean
  hasTokenSymbol?: boolean
  hasAssetImage?: boolean
  hasIconImage?: boolean
  hasTokenType?: boolean
  lastUpdatedAt?: string
}
