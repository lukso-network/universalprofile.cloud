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
  images: ImageMetadata[],
  height: number
): ImageMetadata | undefined => {
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
export const getAssetThumb = (asset?: Asset, useIcon?: boolean) => {
  if (!asset) {
    return ''
  }

  if (asset.isNativeToken) {
    return ASSET_LYX_ICON_URL
  }

  if (asset.icon && useIcon) {
    const icon = asset.icon
    return icon?.url
  }

  if (asset.images && asset.images.length > 0) {
    const image = asset.images[0]
    return image?.url
  }

  return ''
}

/**
 * Creates a Image model object
 *
 * @param image - image metadata array
 * @param height - image height (represents the desired image height)
 * @returns Image model object
 */
export const createImageObject = (image: ImageMetadata[], height: number) => {
  const optimalImage = getImageBySize(image, height)

  if (optimalImage) {
    return {
      ...optimalImage,
      url: resolveUrl(optimalImage.url),
    } as Image
  }
}
