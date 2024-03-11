import type {
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'

// TODO use type from lsp package when it's released
export type LSP4DigitalAssetMetadata = {
  images?: Image[][]
  icon?: Image[]
  description?: string
  assets?: AssetMetadata[]
  attributes?: AttributeMetadata[]
  links?: LinkMetadata[]
}

export type Asset = {
  address?: Address
  isLoading?: boolean
  isOwned?: boolean
  isIssued?: boolean
  assetData?: any
  tokenIdFormat?: number
  referenceContract?: Address
  balance?: string
  decimals?: number
  standard?: string
  tokenName?: string
  tokenSymbol?: string
  tokenType?: number
  supportsInterfaces?: Record<string, boolean>
  isNativeToken?: boolean
  baseURI?: any
  tokenDataURL?: string
  tokenId?: `0x${string}`
  tokenIdIsContract?: boolean
  tokenURI?: string
  owner?: Address
  tokenCreators?: Address[]
  totalSupply?: string
  metadata?: LSP4DigitalAssetMetadata
  tokenMetadata?: LSP4DigitalAssetMetadata
  resolvedMetadata?: LSP4DigitalAssetMetadata
}

export type TokenType = keyof typeof LSP4_TOKEN_TYPES
export type TokenIdFormatKey = keyof typeof LSP8_TOKEN_ID_FORMAT
export type TokenIdFormatValue = (typeof LSP8_TOKEN_ID_FORMAT)[TokenIdFormatKey]
