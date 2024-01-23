export const isLyx = (asset?: Asset) => asset?.isNativeToken

export const isNft = (asset?: Asset) =>
  asset?.standard && NFT_STANDARDS.includes(asset.standard)

export const isToken = (asset?: Asset) =>
  (asset?.standard && TOKEN_STANDARDS.includes(asset.standard)) ||
  asset?.isNativeToken

export const isLsp7 = (asset?: Asset) => asset?.standard === 'LSP7DigitalAsset'

export const isLsp8 = (asset?: Asset) => asset?.standard === 'LSP8DigitalAsset'
