import { ASSET_TYPES } from '@/shared/enums'

export const isLyx = (asset?: Asset) => !!asset?.isNativeToken

export const isCollectible = (asset?: Asset) =>
  asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'

export const isToken = (asset?: Asset) =>
  asset?.tokenType === 'TOKEN' || isLyx(asset)

export const isLsp7 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP7

export const isLsp8 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP8

export const hasTokenId = (asset?: Asset) =>
  !!asset?.tokenId?.length && asset?.tokenId !== '0x'
