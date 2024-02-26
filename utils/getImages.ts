import type { ImageMetadata } from '@lukso/lsp-smart-contracts'
import type { Asset } from '@/models/asset'
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
  images: (ImageMetadata & { src: string })[],
  height: number
): (ImageMetadata & { src: string }) | undefined => {
  const sortedImagesAscending = images.sort((a, b) => {
    if (a.height < b.height) {
      return -1
    }
    if (a.height > b.height) {
      return 1
    }
    return 0
  })

  // check if we can get retina size image
  const retinaImage = sortedImagesAscending.find(
    image => image.height > height * 2
  )

  if (retinaImage) {
    return retinaImage
  }

  // check if we can get normal size image
  const normalImage = sortedImagesAscending.find(image => image.height > height)

  if (normalImage) {
    return normalImage
  }

  // lastly return biggest image available
  return sortedImagesAscending.length > 0
    ? sortedImagesAscending.pop()
    : undefined
}

/**
 * Return asset thumb image for given sizes.
 *
 * @param asset
 * @param minWidth
 * @param minHeight
 * @returns
 */
export const getAssetThumb = (asset?: TokenData, useIcon?: boolean) => {
  if (!asset) {
    return ''
  }

  if (asset.isNativeToken) {
    return ASSET_LYX_ICON_URL
  }

  if (useIcon) {
    const icon = asset.baseURIIcon || asset.forTokenIcon || asset.icon
    const url = getImageBySize(icon, 260)?.src
    if (url) {
      return url + '&width=100&height=260'
    }
  }

  const images = asset.baseURIImages || asset.forTokenImages || asset.images
  const image = images?.[0]
  const url = getImageBySize(image, 260)?.src
  if (url) {
    return url + '&width=100&height=260'
  }

  return undefined
}

/**
 * Creates a Image model object
 *
 * @param image - image metadata array
 * @param height - image height (represents the desired image height)
 * @returns Image model object
 */
export const createImageObject = (image?: ImageMetadata[], height = 100) => {
  if (!image) {
    return undefined
  }

  const optimalImage = getImageBySize(image, height)

  if (optimalImage) {
    const { verification, url } = optimalImage
    return {
      ...optimalImage,
      src: url.startsWith('ipfs://')
        ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
        : url,
    } as Image
  }
}
