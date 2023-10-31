import { ImageMetadata } from '@lukso/lsp-smart-contracts'

import { ImageMetadataEncoded } from '@/types/assets'
import { formatUrl } from '@/utils/formatUrl'
import { Asset } from '@/models/asset'

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
  const request = new Request(formatUrl(imageUrl))
  return (await fetchBlobAndConvertToBase64(request)) as Base64EncodedImage
}

/**
 * Gets a correct image url from an array of possible image
 * by checking the max height and min width of the image.
 *
 * @param {ImageMetadata[]} images - an array of images to check
 * @param {number} minWidth - min width
 * @param {number} maxHeight - max height
 * @returns url of the image
 */
export const getImageBySize = (
  images: ImageMetadata[],
  maxHeight: number
): ImageMetadata | undefined => {
  for (const image of images) {
    if (image.height <= maxHeight) {
      return image
    }
  }
  return images.length > 0 ? images[0] : undefined
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

  if (asset.iconId && useIcon) {
    const icon = useRepo(ImageModel).find(asset.iconId)
    return icon?.base64
  }

  if (asset.imageIds && asset.imageIds.length > 0) {
    const image = useRepo(ImageModel).find(asset.imageIds[0])
    return image?.base64
  }

  return ''
}

export const getAndConvertImage = async (
  image: ImageMetadata[],
  maxHeight: number
) => {
  const optimalImage = getImageBySize(image, maxHeight)

  if (optimalImage) {
    return {
      ...optimalImage,
      base64: formatUrl(optimalImage.url),
      // base64: await fetchAndConvertImage(optimalImage.url), // TODO add base when cache storage is added
    } as ImageMetadataEncoded
  }
}
