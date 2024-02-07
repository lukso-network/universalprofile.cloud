export const isLyx = (asset?: Asset) => asset?.isNativeToken

export const isCollectible = (asset?: Asset) =>
  asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'

export const isToken = (asset?: Asset) =>
  asset?.tokenType === 'TOKEN' || asset?.isNativeToken

export const isLsp7 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP7

export const isLsp8 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP8
