import type { Image } from '@/types/image'

const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsDataURL(blob)
  })

const fetchBlobAndConvertToBase64 = async (
  request: Request
): Promise<unknown> => {
  return fetch(request)
    .then(response => response.blob())
    .then(convertBlobToBase64)
}

export const fetchAndConvertImage = async (imageUrl: string) => {
  const request = new Request(resolveUrl(imageUrl))
  return (await fetchBlobAndConvertToBase64(request)) as Base64EncodedImage
}

/**
 * !DEPRECATED - remove this
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
  const sortedImagesAscending = images?.sort((a, b) => {
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

  const normalImage = sortedImagesAscending?.find(
    image =>
      image.width && image.width > width && image.height && image.height > width
  )

  if (normalImage) {
    return normalImage
  }

  // lastly return biggest image available
  return getLargestImage(images)
}

export const getLargestImage = (
  images: Image[] | undefined
): Image | undefined => {
  const sortedImagesAscending = images?.sort((a, b) => {
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

  return sortedImagesAscending && sortedImagesAscending.length > 0
    ? sortedImagesAscending[0]
    : undefined
}

/**
 * Get optimized image using Cloudflare proxy from
 *
 * @param profileImages
 * @param width
 * @returns
 */
export const getOptimizedImage = (
  profileImages: Image[] | undefined,
  width: number
): string | undefined => {
  const dpr = window.devicePixelRatio || 1
  const desiredWidth = width * dpr
  const { verification, url } =
    getImageBySize(profileImages, width * desiredWidth) || {}

  if (url) {
    const queryParams = {
      method: verification?.method || '0x00000000',
      data: verification?.data || '0x',
      width: width * 2, // for retina we double size
      ...(dpr !== 1 ? { dpr } : {}),
    }

    const queryParamsString = Object.entries(queryParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    return url.startsWith('ipfs://')
      ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?${queryParamsString}`
      : url
  }
}

/**
 * Return asset thumb image for given sizes.
 *
 * @param asset
 * @param minWidth
 * @param minHeight
 * @returns
 */
export const getAssetThumb = (
  asset?: Asset | null,
  useIcon?: boolean,
  size = 100
): string | undefined => {
  console.log(asset)
  if (!asset) {
    return ''
  }

  if (asset.isNativeToken) {
    return ASSET_LYX_ICON_URL
  }

  if (useIcon) {
    const icon =
      asset.lsp7Icon || asset.baseURIIcon || asset.forTokenIcon || asset.icon
    const url = getImageBySize(icon, size || 260)?.src
    if (url) {
      return url.startsWith('https://api.universalprofile.cloud/image/')
        ? url + `&width=${size || 260}&height=${size || 260}`
        : url
    }
  }

  const images =
    asset.lsp7Images ||
    asset.baseURIImages ||
    asset.forTokenImages ||
    asset.images
  const image = images?.[0]
  const url = getImageBySize(image, 260)?.src
  if (url) {
    return url.startsWith('https://api.universalprofile.cloud/image/')
      ? url + `&width=${size || 260}&height=${size || 260}`
      : url
  }

  return undefined
}

/**
 * !DEPRECATED - remove this
 * Creates a Image model object
 *
 * @param image - image metadata array
 * @param height - image height (represents the desired image height)
 * @returns Image model object
 */
// export const createImageObject = (
//   image?: (ImageMetadata & { src?: string })[],
//   height = 100
// ) => {
//   if (!image) {
//     return undefined
//   }

//   return getImageBySize(image, height)
// }
