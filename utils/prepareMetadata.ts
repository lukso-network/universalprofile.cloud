import { LUKSO_PROXY_API } from '@/shared/config'

export const prepareMetadata = (metadata: LSP4DigitalAssetMetadataJSON) => {
  const validatedMetadata = validateLsp4Metadata(metadata)

  const { links, description, attributes } =
    validatedMetadata.LSP4Metadata || {}
  const assets =
    validatedMetadata?.LSP4Metadata?.assets?.map((asset: AssetMetadata) => {
      const { url } = asset as FileAsset

      // TODO add url verification check
      return url
        ? ({
            ...asset,
            src: url.startsWith('ipfs://') ? resolveUrl(url) : url,
          } as AssetMetadata & { src: string })
        : asset
    }) || []
  const images = prepareImagesNested(validatedMetadata?.LSP4Metadata?.images)
  const icon = prepareImages(validatedMetadata?.LSP4Metadata?.icon)

  return {
    images,
    icon,
    attributes,
    description,
    links,
    assets,
  } as LSP4DigitalAssetMetadata
}

export const prepareImage = (image: any) => {
  const { verification, url } = image

  return {
    ...image,
    src: url.startsWith('ipfs://')
      ? `${LUKSO_PROXY_API}/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
      : url,
  } as Image & { src: string }
}

export const prepareImages = (images?: any[]) => {
  return (
    images?.map((image: any) => {
      return prepareImage(image)
    }) || []
  )
}

export const prepareImagesNested = (imagesNested?: any[][]) => {
  return (
    imagesNested?.map((images: any) => {
      return (
        images?.map((image: any) => {
          return prepareImage(image)
        }) || []
      )
    }) || []
  )
}
