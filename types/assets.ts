import {
  INTERFACE_IDS,
  ImageMetadata,
  LSP8_TOKEN_ID_FORMAT,
} from '@lukso/lsp-smart-contracts'

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

export const Lsp8TokenIdType = {
  NUMBER: 0,
  STRING: 1,
  UNIQUE_ID: 2,
  HASH: 3,
  ADDRESS: 4,
} as typeof LSP8_TOKEN_ID_FORMAT

export type Base64EncodedImage = `data:image/jpeg;base64${string}`

export type ImageMetadataEncoded = Partial<ImageMetadata> & {
  base64?: Base64EncodedImage
  profileId?: Address
  assetId?: Address
}
