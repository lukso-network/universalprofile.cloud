import { LUKSO_PROXY_API } from '@/shared/config'

import type { Image } from '@/types/image'

/**
 * Make the image reactive if needed
 * @param imageObject
 * @retursn reactive image object
 */
export const reactiveImageIfNeeded = (
  imageObject: Image,
  images: Image[]
): Image => {
  if (imageObject && imageObject.url?.startsWith('cached://')) {
    const index = images.findIndex(
      image =>
        image.url === imageObject.url && image.width === imageObject.width
    )
    imageObject = images[index] = reactive(images[index])
    imageObject.url = ASSET_ICON_PLACEHOLDER_URL // TODO: This should be the loading image but it probably doesn't matter
    resolveImageURL(imageObject?.url, ASSET_ERROR_ICON_URL).then(url => {
      imageObject.url = url
    })
    return imageObject
  }
  return imageObject
}

/**
 * Gets a correct image url from an array of possible image
 * by checking the height of the image.
 * It try to find retina version of the image first, then normal version of the image
 * and lastly the biggest image available.
 *
 * @param {ImageMetadata[]} images - an array of images to check
 * @param {number} height - the desired height of the image
 * @returns url of the image
 */
export const getImageBySize = (
  images: Image[] | undefined,
  width: number
): Image | undefined => {
  const sortedImagesAscending = (images || []).slice()
  sortedImagesAscending.sort((a, b) => {
    // reverse sort largest last
    if (!a.width || !b.width) {
      return 0
    }
    if (a.width < b.width) {
      return -1
    }
    if (a.width > b.width) {
      return 1
    }
    return 0
  })

  const dpr = window.devicePixelRatio || 1
  const normalImage = sortedImagesAscending?.find(
    image => image.width && image.width > width * dpr
  )

  if (normalImage) {
    return reactiveImageIfNeeded(normalImage, images as Image[])
  }

  // lastly return biggest image available
  return reactiveImageIfNeeded(
    sortedImagesAscending?.slice(-1)[0],
    images as Image[]
  )
}

const EXTRACT_CID = new RegExp(
  `^(ipfs://|${LUKSO_PROXY_API}/(ipfs|image)/)(?<cid>.*?)(\\?.*?)?$`
)

/**
 * Get optimized image using Cloudflare proxy
 *
 * @param profileImages
 * @param width
 * @returns
 */
export const getOptimizedImage = (
  image: Image[] | undefined,
  width: number
): string => {
  const dpr = window.devicePixelRatio || 1
  const { verification, url } = getImageBySize(image, width) || {}
  const { verified } = (verification || {}) as any
  if (
    url?.startsWith('ipfs://') ||
    url?.startsWith(`${LUKSO_PROXY_API}/image/`)
  ) {
    const queryParams = {
      ...(verified != null
        ? {
            /* this is already verified no need to verify it on the proxy */
          }
        : {
            method: verification?.method || '0x00000000',
            data: verification?.data || '0x',
          }),
      width: width * dpr,
      ...(dpr !== 1 ? { dpr } : {}),
    }

    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const { cid } = EXTRACT_CID.exec(url || '')?.groups || {}
    if (cid) {
      return `${LUKSO_PROXY_API}/image/${cid}?${queryParamsString}`
    }
  }
  return url || ''
}

/**
 * Return image for given sizes bu checking within image or icon arrays
 *
 * @param asset
 * @param minWidth
 * @param minHeight
 * @returns
 */
export const getAssetThumb = (
  asset: Asset | null | undefined,
  useIcon: boolean,
  width: number,
  hasImageError?: boolean
): string => {
  if (hasImageError) {
    return ASSET_ERROR_ICON_URL
  }

  if (!asset) {
    return ''
  }

  if (asset.isNativeToken) {
    return ASSET_LYX_ICON_URL
  }

  const { icon, images } = asset.resolvedMetadata || {}

  if (useIcon && icon) {
    return getOptimizedImage(icon, width)
  }

  const image = images?.[0]

  if (image) {
    return getOptimizedImage(image, width)
  }

  if (icon) {
    return getOptimizedImage(icon, width)
  }

  return ''
}
