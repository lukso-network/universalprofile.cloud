import { INTERFACE_IDS, type ImageMetadata } from '@lukso/lsp-smart-contracts'

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

export type Base64EncodedImage = `data:image/jpeg;base64${string}`

export type ImageMetadataWithRelationships = Partial<ImageMetadata> & {
  profileId?: Address
  assetId?: Address
  id?: string
}
