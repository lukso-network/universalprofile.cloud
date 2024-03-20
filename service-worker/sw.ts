/// <reference lib="WebWorker" />
/// <reference types="vite/client" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { keccak256 } from 'js-sha3'

import { processMetadata } from '../utils/processMetadata'

declare let self: ServiceWorkerGlobalScope

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST)

// clean old assets
cleanupOutdatedCaches()

// let allowlist: undefined | RegExp[]
// if (import.meta.env.DEV) allowlist = [/^\/$/]

// to allow work offline
registerRoute(
  '/hash-images',
  async ({
    // event, // : ExtendableEvent;
    request, // : Request;
    // url, // : URL;
    // params, // ?: string[] | MapLikeObject;
  }) => {
    const data = await request.json()
    const response = await processMetadata(data, keccak256).catch(error => {
      console.error(error)
      throw error
    })
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  },
  'POST'
)
registerRoute(
  /\/hashed-images\/.*/,
  async ({ request }) => {
    const cache = await caches.open('hashed-image-cache')
    const responseFromCache = await cache.match(request)
    if (responseFromCache) {
      return responseFromCache.clone()
    }
    return fetch('public/images/image-error.svg')
  },
  'GET'
)
// registerRoute(new NavigationRoute(createHandlerBoundToURL('/'), { allowlist }))

self.skipWaiting()
clientsClaim()
