import {
  VueQueryPlugin,
  QueryClient,
  hydrate,
  dehydrate,
} from '@tanstack/vue-query'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

import { defaultQueryFn } from '@/utils/queryFunctions'

import type {
  DehydratedState,
  VueQueryPluginOptions,
} from '@tanstack/vue-query'
import type { NuxtApp } from 'nuxt/app'

export default defineNuxtPlugin((nuxt: NuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')
  const {
    public: { BUILD_VERSION: buster = 'debug' },
  } = useRuntimeConfig()
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        gcTime: 1000 * 60 * 60 * 24,
        queryFn: defaultQueryFn,
      },
    },
  })

  const options: VueQueryPluginOptions = {
    queryClient,
    clientPersister: queryClient =>
      persistQueryClient({
        queryClient,
        persister: createSyncStoragePersister({ storage: localStorage }),
        buster: buster as string,
      }),
  }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (process.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (process.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
