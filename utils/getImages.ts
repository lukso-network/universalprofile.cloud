import { ImageMetadata } from '@lukso/lsp-smart-contracts'

import { ImageMetadataEncoded } from '@/types/assets'
import { Asset } from '@/models/asset'
import { ImageRepository } from '@/repositories/image'

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

  const imageRepo = useRepo(ImageRepository)

  if (asset.iconId && useIcon) {
    const icon = imageRepo.getImage(asset.iconId)
    return icon?.base64
  }

  if (asset.imageIds && asset.imageIds.length > 0) {
    const image = imageRepo.getImage(asset.imageIds[0])
    return image?.base64
  }

  return ''
}

export const getAndConvertImage = async (
  image: ImageMetadata[],
  height: number
) => {
  const optimalImage = getImageBySize(image, height)

  if (optimalImage) {
    return {
      ...optimalImage,
      base64: resolveUrl(optimalImage.url),
      // base64: await fetchAndConvertImage(optimalImage.url), // TODO add base when cache storage is added
      id: getImageId(optimalImage),
    } as ImageMetadataEncoded
  }
}
