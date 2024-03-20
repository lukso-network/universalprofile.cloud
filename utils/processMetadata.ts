import { keccak256 } from 'web3-utils'
import debug from 'debug'

import { TANSTACK_GC_TIME, LUKSO_PROXY_API } from '@/shared/config'

const workersLog = debug('tanstack:workers')

export async function processMetadata(
  data: any,
  prefix = '/hashed-images/'
): Promise<any> {
  if (Array.isArray(data)) {
    return Promise.all(data.map(data => processMetadata(data, prefix)))
  }
  if (data != null && typeof data === 'object') {
    if (data.url?.startsWith('data:')) {
      const [, mime, encoding, image] =
        data.url.match(/^data:(.*?);(.*?),(.*)$/) || []
      if (encoding && image) {
        const cache = await caches.open('hashed-image-cache')
        const imageBytes = encoding === 'base64' ? atob(image) : image
        const hash = keccak256(imageBytes)
        let verified: boolean | undefined = undefined
        if (data.verification) {
          verified = data.verification?.data && hash === data.verification?.data
        }
        const key = `/hashed-images/${hash}`
        const cachedImage = await cache.match(key)
        if (cachedImage) {
          return {
            ...data,
            ...(verified != null
              ? { verification: { ...data.verification, verified } }
              : {}),
            url: `${prefix}${hash}`,
          }
        }
        // Fake entries must be cached for TANSTACK_GC_TIME
        await cache.put(
          key,
          new Response(imageBytes, {
            headers: {
              'Content-Type': mime,
              'X-Verified':
                verified != null ? (verified ? 'true' : 'false') : '',
              'Cache-Control': `public, max-age=${Math.round(TANSTACK_GC_TIME / 1000) + 60}, immutable`,
            },
          })
        )
        return {
          ...data,
          ...(verified != null
            ? { verification: { ...data.verification, verified } }
            : {}),
          url: `${prefix}${hash}`,
        }
      }
    }
    if (
      data.url?.startsWith('ipfs://') ||
      data.url?.startsWith(`${LUKSO_PROXY_API}/image/`)
    ) {
      const queryParams = {
        method: data.verification?.method || '0x00000000',
        data: data.verification?.data || '0x',
      }
      const queryParamsString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')

      const newUrl = `${LUKSO_PROXY_API}/image/${data.url.replaceAll(/^ipfs:\/\/|\?.*?$/g, '')}?${queryParamsString}`
      const cache = await caches.open('hashed-image-cache')
      const imageResponse = await cache.match(newUrl)
      const verified = imageResponse?.headers.get('x-verified')
      return {
        ...data,
        url: newUrl,
        ...(verified != null
          ? {
              ...data.verification,
              verified: verified === 'true',
            }
          : {}),
      }
    }
    return Promise.all(
      Object.entries(data).map(async ([key, value]) => [
        key,
        await processMetadata(value),
      ])
    ).then(entries => Object.fromEntries(entries))
  }
  return data
}

/**
 * Process metadata within the browser. It will attempt to use the service worker, but otherwise
 * it will fall back to the regular processMetadata function.
 *
 * @param data JSON data to process
 * @returns processed JSON data
 */
export async function browserProcessMetadata(data: any): Promise<any> {
  return await fetch('/hash-images', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  }).then(async response => {
    if (response.status !== 200) {
      // If the service worker does not exist or process this request
      // then we need to do local processing and will return "cached://HASH" urls instead.
      const result = await processMetadata(data, 'cached://')
      workersLog('process-local', result)
      return result
    }
    const result = await response.json()
    workersLog('process', result)
    return result
  })
}

/**
 * If the service worker is not available, then this function will get a data URL from cache
 * and return it.
 *
 * @param url url to proxess
 * @param errorImage an error image if the url is not cached
 * @returns the resolved data url.
 */
export async function resolveImageURL(
  url: string,
  errorImage: string
): Promise<string> {
  if (url.startsWith('cached://')) {
    const hash = url.slice(9)
    const cache = await caches.open('image-cache')
    const cachedImage = await cache.match(`/hashed-images/${hash}`)
    if (cachedImage) {
      return URL.createObjectURL(await cachedImage.blob())
    }
    return errorImage
  }
  return url
}
