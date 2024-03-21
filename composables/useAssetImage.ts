export const useAssetImage = (
  _asset: MaybeRef<Asset | null | undefined>,
  useIcon: boolean,
  width: number
) =>
  computed(() => {
    const asset: Asset | null = isRef(_asset)
      ? _asset.value || null
      : _asset || null

    if (!asset) {
      return ''
    }

    if (asset.isNativeToken) {
      return ASSET_LYX_ICON_URL
    }

    const { icon, images } = asset.resolvedMetadata || {}

    if (useIcon && icon) {
      return getOptimizedImage(icon, width)
    }

    const image = images?.[0]

    if (image) {
      return getOptimizedImage(image, width)
    }

    if (icon) {
      return getOptimizedImage(icon, width)
    }

    return IMAGE_ERROR_URL
  })
