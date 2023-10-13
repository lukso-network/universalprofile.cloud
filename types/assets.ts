import { ImageMetadata, LinkMetadata } from '@lukso/lsp-factory.js'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'

export type InterfaceId = keyof typeof INTERFACE_IDS

export const tokenStandards: InterfaceId[] = ['LSP7DigitalAsset']
export const nftStandards: InterfaceId[] = ['LSP8IdentifiableDigitalAsset']

export const StandardsAbbreviations: { [K in InterfaceId]?: string } = {
  LSP7DigitalAsset: 'LSP7',
  ERC20: 'ERC20',
  LSP8IdentifiableDigitalAsset: 'LSP8',
}

export enum AssetFilter {
  owned = 'owned',
  created = 'created',
}

export enum Lsp8TokenIdType {
  address = '1',
  number = '2',
  bytes32 = '3',
}

export type Asset = {
  // generic (ERC20)
  address?: Address
  name?: string
  symbol?: string
  amount?: string
  decimals?: string
  tokenSupply?: string

  // LSP7/LSP8
  icon?: string
  standard?: InterfaceId
  description?: string
  images?: ImageMetadata[]
  links?: LinkMetadata[]
  creatorName?: string
  creatorAddress?: Address
  creatorProfileImage?: string
  tokenId?: string

  // custom
  isNativeToken?: boolean
  metadata?: any
}
