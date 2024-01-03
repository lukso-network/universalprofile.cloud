import { ImageMetadata } from '@lukso/lsp-smart-contracts'

import { Asset } from '@/models/asset'
import { ImageRepository } from '@/repositories/image'
import { Image } from '@/models/image'

type ImageObjectCache = { encodedImage: Base64EncodedImage; url: string }

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
export const getAssetThumb = async (asset?: Asset, useIcon?: boolean) => {
  if (!asset) {
    return ''
  }

  if (asset.isNativeToken) {
    return ASSET_LYX_ICON_URL
  }

  const imageRepo = useRepo(ImageRepository)

  if (asset.iconId && useIcon) {
    const icon = imageRepo.getImage(asset.iconId)
    const cachedIcon = await getCachedImageUrl(icon)
    return cachedIcon
  }

  if (asset.imageIds && asset.imageIds.length > 0) {
    const image = imageRepo.getImage(asset.imageIds[0])
    const cachedImage = await getCachedImageUrl(image)
    return cachedImage
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
export const createImageObject = async (
  image: ImageMetadata[],
  height: number
) => {
  const optimalImage = getImageBySize(image, height)

  if (optimalImage) {
    return {
      ...optimalImage,
      id: getHash(optimalImage),
    } as Image
  }
}

/**
 * Gets a base64 encoded image from cache.
 * If there is no image in cache, it will use original image url and do caching afterwards.
 *
 * @param image - image to get from cache
 * @returns
 */
export const getCachedImageUrl = async (image?: Image) => {
  const cache = await caches.open(CACHE_KEY.IMAGE_CACHE)

  if (!image || !image.url) {
    return ''
  }

  const imageUrl = resolveUrl(image.url)
  const cachedImage = await cache.match(imageUrl)

  if (cachedImage) {
    const imageObjectCache: ImageObjectCache = await cachedImage.json()
    return imageObjectCache.encodedImage
  } else {
    const fetchedImage = await fetchAndConvertImage(imageUrl)
    const imageObjectCache: ImageObjectCache = {
      encodedImage: fetchedImage,
      url: imageUrl,
    }
    await cache.put(
      imageUrl,
      new Response(JSON.stringify(imageObjectCache), {
        headers: {
          'Content-Length': imageObjectCache.encodedImage.length.toString(),
        },
      })
    )
  }

  return imageUrl
}
