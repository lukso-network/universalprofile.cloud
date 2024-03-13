export const prepareMetadata = (metadata: LSP4DigitalAssetMetadataJSON) => {
  const { links, description, attributes } = metadata.LSP4Metadata || {}
  const assets =
    metadata?.LSP4Metadata?.assets?.map((asset: AssetMetadata) => {
      const { url } = asset as FileAsset

      // TODO add url verification check
      return url
        ? ({
            ...asset,
            src: url.startsWith('ipfs://') ? resolveUrl(url) : url,
          } as AssetMetadata & { src: string })
        : asset
    }) || []
  const images =
    metadata?.LSP4Metadata?.images?.map((images: any) => {
      return images.map((image: any) => {
        const { verification, url } = image
        return {
          ...image,
          src: url.startsWith('ipfs://')
            ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
            : url,
        } as Image & { src: string }
      })
    }) || []
  const icon =
    metadata?.LSP4Metadata?.icon?.map((image: any) => {
      const { verification, url } = image
      return {
        ...image,
        src: url.startsWith('ipfs://')
          ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
          : url,
      } as Image & { src: string }
    }) || []

  return {
    images,
    icon,
    attributes,
    description,
    links,
    assets,
  } as LSP4DigitalAssetMetadata
}
