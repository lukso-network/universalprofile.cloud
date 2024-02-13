import type {
  LSP4DigitalAssetMetadataJSON,
  AssetMetadata,
} from '@lukso/lsp-smart-contracts'

export const validateLsp4MetaData = (
  LSP4MetadataJSON: any
): LSP4DigitalAssetMetadataJSON => {
  const { LSP4Metadata: metadata } = LSP4MetadataJSON || {}

  let images = [[]]
  let links = []
  let assets = []
  let icon = []
  const attributes = validateAttributes(metadata.attributes)

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

  if (LSP4MetadataJSON?.LSP4Metadata?.icon?.length) {
    icon = LSP4MetadataJSON?.LSP4Metadata?.icon?.filter((image: any) => {
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
      //@ts-ignore - ignore until release or lsp package
      attributes,
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

/**
 * Validate if the given metadata object follows proper structure and contain `hash` property
 * This is legacy format still used on Testnet.
 *
 * @param getDataObject - metadata object to be validated
 * @returns - hash if validation passes, undefined otherwise
 */
export const validateHash = (getDataObject: any) => {
  return !!getDataObject &&
    typeof getDataObject === 'object' &&
    typeof getDataObject?.value === 'object' &&
    getDataObject?.value !== null &&
    'hash' in getDataObject?.value &&
    typeof getDataObject.value?.hash === 'string'
    ? (getDataObject.value?.hash as string)
    : undefined
}

/**
 * Validates if the given metadata object follows proper structure and contain `verification` property
 * This is new format used on Mainnet.
 *
 * @param getDataObject - metadata object to be validated
 * @returns - verification object if validation passes, undefined otherwise
 */
export const validateVerification = (getDataObject: any) => {
  return !!getDataObject &&
    typeof getDataObject === 'object' &&
    'value' in getDataObject &&
    typeof getDataObject?.value === 'object' &&
    getDataObject?.value !== null &&
    'verification' in getDataObject?.value &&
    'data' in getDataObject?.value?.verification &&
    'method' in getDataObject?.value?.verification
    ? (getDataObject.value?.verification as AssetMetadata['verification'])
    : undefined
}

/**
 * Validates the given attribute object follows proper structure
 *
 * @param attribute
 * @returns
 */
export const validateAttributes = (attributes: any) => {
  if (!attributes?.length) {
    return []
  }

  const validateAttributes = attributes?.filter((attribute: any) => {
    return (
      attribute.key ||
      attribute.value ||
      attribute.type === 'string' ||
      attribute.type === 'number' ||
      attribute.type === 'date'
    )
  })

  if (!validateAttributes.length) {
    console.warn('Invalid LSP4 attribute')
    return []
  }

  return validateAttributes
}
