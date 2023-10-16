import { Asset, nftStandards, tokenStandards } from '@/types/assets'

export const isLyx = (asset?: Asset) => asset?.isNativeToken

export const isNft = (asset?: Asset) =>
  asset?.standard && nftStandards.includes(asset.standard)

export const isToken = (asset?: Asset) =>
  asset?.standard && tokenStandards.includes(asset.standard)

export const isLsp7 = (asset?: Asset) => asset?.standard === 'LSP7DigitalAsset'

export const isLsp8 = (asset?: Asset) =>
  asset?.standard === 'LSP8IdentifiableDigitalAsset'
