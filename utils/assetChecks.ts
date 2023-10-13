import { Asset } from '@/types/assets'

export const isLyx = (asset?: Asset) => asset?.isNativeToken

export const isNft = (asset?: Asset) =>
  asset?.standard === 'LSP8IdentifiableDigitalAsset'
