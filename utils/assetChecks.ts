import { SendAsset } from '@/types/assets'

export const isLyx = (asset?: SendAsset) => asset?.isNativeToken

export const isNft = (asset?: SendAsset) =>
  asset?.standard === 'LSP8IdentifiableDigitalAsset'
