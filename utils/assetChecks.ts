import type { AssetData } from '@/composables/useProfileAssets'
import type { TokenData } from '@/composables/useToken'

/**
 * Check if passed asset is LYX token
 * @param asset
 * @returns
 */
export const isLyx = (asset?: TokenData | AssetData) => !!asset?.isNativeToken

/**
 * Check if passed asset is collectible
 *
 * @param asset
 * @returns
 */
export const isCollectible = (asset?: TokenData | AssetData) =>
  asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'

/**
 * Check if passed asset is token
 *
 * @param asset
 * @returns
 */
export const isToken = (asset?: TokenData | AssetData) =>
  asset?.tokenType === 'TOKEN' || isLyx(asset)

/**
 * Check if passed asset is LSP7 token
 *
 * @param asset
 * @returns
 */
export const isLsp7 = (asset?: TokenData | AssetData) =>
  asset?.standard === STANDARDS.LSP7

/**
 * Check if passed asset is LSP8 token
 *
 * @param asset
 * @returns
 */
export const isLsp8 = (asset?: TokenData | AssetData) =>
  asset?.standard === STANDARDS.LSP8

/**
 * Check if passed asset has a token id
 *
 * @param asset
 * @returns
 */
export const hasTokenId = (asset?: TokenData | AssetData) =>
  !!asset?.tokenId?.length && asset?.tokenId !== '0x'

/**
 * Check if passed asset is LSP7 or LSP8
 *
 * @param asset
 * @returns
 */
export const isAsset = (asset?: TokenData | AssetData) =>
  asset?.standard === STANDARDS.LSP7 || asset?.standard === STANDARDS.LSP8
