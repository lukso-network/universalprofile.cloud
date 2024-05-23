export type CacheOptions = {
  key: string
  expiryAfter: number
  bucket?: string
}

export type CacheReturnObject<T> = { value: T; expires: number }

/**
 * Store value from function into browser cache.
 *
 * @param getValue
 * @param options
 * @returns
 */
const cacheValue = async <T>(
  getValue: () => Promise<T>,
  options: CacheOptions
) => {
  const { currentNetwork } = storeToRefs(useAppStore())
  const cache = await caches.open(options.bucket || CACHE_KEY.SETTINGS)
  const url = `${options.key}-${currentNetwork.value.id}`
  const cacheData = await cache.match(url)

  if (cacheData) {
    const cacheDataJson: CacheReturnObject<T> = await cacheData.json()

    if (cacheDataJson.expires > Date.now()) {
      return cacheDataJson.value
    }
    caches.delete(url)
  }

  try {
    const value = await getValue()
    const cacheObject: CacheReturnObject<T> = {
      value,
      expires: Date.now() + options.expiryAfter,
    }
    await cache.put(url, new Response(JSON.stringify(cacheObject)))
    return value
  } catch (error) {
    console.error('Cache fetch error', error)
    return
  }
}

export const useCache = () => {
  return {
    cacheValue,
  }
}
