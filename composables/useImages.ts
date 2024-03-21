export const useProfileAvatar = (
  _profile: MaybeRef<Profile | null | undefined>,
  width: number
) => {
  const profileAvatar = computed(() => {
    const profile = isRef(_profile) ? _profile.value || null : _profile || null
    const { profileImage } = profile || {}
    return profileImage
  }) as Ref<Image[] | null>
  return getOptimizedImage(profileAvatar, width)
}

export const useProfileBackground = (
  _profile: MaybeRef<Profile | null | undefined>,
  width: number
) => {
  const profileBackground = computed(() => {
    const profile = isRef(_profile) ? _profile.value || null : _profile || null
    const { backgroundImage } = profile || {}
    return backgroundImage
  }) as Ref<Image[] | null>
  return getOptimizedImage(profileBackground, width)
}

export const useOptimizedImages = (
  _images: MaybeRef<Image[][] | null>,
  width: number
) => {
  return computed(() => {
    const images = isRef(_images) ? _images.value || null : _images || null
    return images?.map(image => {
      const url = getOptimizedImage(image, width)
      return {
        url,
        original: image,
      }
    })
  })
}

export const useOptimizedImage = (
  image: MaybeRef<Image[] | null>,
  width: number
) => {
  return getOptimizedImage(image, width)
}

export const useAssetImage = (
  _asset: MaybeRef<Asset | null | undefined>,
  useIcon: boolean,
  width: number
) => {
  const assetIcon = computed(() => {
    const asset = isRef(_asset) ? _asset.value || null : _asset || null
    console.log('asset', asset)
    const { resolvedMetadata } = asset || {}
    const { icon } = resolvedMetadata || {}
    return icon
  }) as Ref<Image[] | null>
  const assetImage = computed(() => {
    const asset = isRef(_asset) ? _asset.value || null : _asset || null
    const { resolvedMetadata } = asset || {}
    const { images } = resolvedMetadata || {}
    return images?.[0] || null
  }) as Ref<Image[] | null>
  const currentIcon = getOptimizedImage(assetIcon, width)
  const currentImage = getOptimizedImage(assetImage, width)
  const assetIsNativeToken = computed(() => {
    const asset = isRef(_asset) ? _asset.value || null : _asset || null
    const { isNativeToken } = asset || {}
    return isNativeToken
  })
  return computed(() => {
    if (assetIsNativeToken.value) {
      return ASSET_LYX_ICON_URL
    }
    console.log({
      image: assetImage.value,
      icon: assetIcon.value,
      currentImage: currentImage.value,
      currentIcon: currentIcon.value,
      isNativeToken: assetIsNativeToken.value,
    })
    if (useIcon) {
      return currentIcon.value
    }
    if (currentImage.value) {
      return currentImage.value
    }
    if (currentImage.value) {
      return currentIcon.value
    }
    if (!assetIcon.value && !assetImage.value) {
      return ''
    }
    return IMAGE_ERROR_URL
  })
}
