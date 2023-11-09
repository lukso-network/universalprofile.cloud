import { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'

export const validateLsp4MetaData = (
  LSP4MetadataJSON: any
): LSP4DigitalAssetMetadataJSON => {
  let images = [[]]
  let links = []
  let assets = []
  let icon = []

  if (LSP4MetadataJSON?.LSP4Metadata?.images?.length) {
    images = LSP4MetadataJSON?.LSP4Metadata?.images?.filter((image: any) => {
      if (!image?.length) return false

      return validateImages(image)
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.links?.length) {
    links = LSP4MetadataJSON?.LSP4Metadata?.links.filter((link: any) => {
      return link?.title && link?.url
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.assets?.length) {
    assets = LSP4MetadataJSON?.LSP4Metadata?.assets.filter((asset: any) => {
      return validateAsset(asset)
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.icons?.length) {
    icon = LSP4MetadataJSON?.LSP4Metadata?.icons?.filter((image: any) => {
      return validateImage(image)
    })
  }

  return {
    LSP4Metadata: {
      description: LSP4MetadataJSON?.LSP4Metadata?.description || '',
      links,
      images,
      assets,
      icon,
    },
  }
}

/**
 * Validates if the given image object follows proper structure
 * It checks for old format using `hash` property and
 * new format using `verification` property.
 *
 * @param image - image object to be validated
 * @returns - true if validation passes, false otherwise
 */
const validateImage = (image: any) => {
  return (
    (image.width &&
      image.height &&
      image.url &&
      image.hash &&
      image.hashFunction) ||
    (image.width &&
      image.height &&
      image.url &&
      image.verification &&
      image.verification.data &&
      image.verification.method)
  )
}

export const validateImages = (images: any[]) => {
  return images.every(imageSize => {
    return validateImage(imageSize)
  })
}

/**
 * Get image id from image object
 * It checks for old format using `hash` property and
 * new format using `verification.data` property.
 *
 * @param image
 * @returns
 */
export const getImageId = (image: any): string | undefined => {
  return (
    image &&
    ('hash' in image && image.hash !== ''
      ? image.hash
      : image?.verification?.data)
  )
}

/**
 * Validate if the given asset object follows proper structure
 *
 * @param asset
 * @returns
 */
const validateAsset = (asset: any) => {
  return (
    (asset.url && asset.fileType && asset.hash && asset.hashFunction) ||
    (asset.url &&
      asset.fileType &&
      asset.verification &&
      asset.verification.data &&
      asset.verification.method)
  )
}
