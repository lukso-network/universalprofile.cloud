import { useQueries } from '@tanstack/vue-query'

import type { AssetQuery } from '@/.nuxt/gql/default'

type QueryResult = AssetQuery
type QueryResultAsset = AssetQuery['asset']

export function useAssetGraph() {
  return (_address?: MaybeRef<Address | undefined>) => {
    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = computed(() => connectedProfile.value?.address)
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const address: Address | undefined = unref(_address)

      const queries = address
        ? [
            {
              // 0
              queryKey: ['asset-graph', address, chainId, profileAddress],
              queryFn: async () => {
                const { asset }: QueryResult = await GqlAsset({
                  address,
                })

                if (graphLog.enabled) {
                  graphLog('asset-raw', asset)
                }

                return asset as QueryResultAsset
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
          ]
        : []
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const data = results[0]?.data as QueryResultAsset | undefined
        const assetData = data?.[0]

        const asset = createAssetObject(assetData)

        if (graphLog.enabled) {
          graphLog('asset', asset)
        }

        return asset
      },
    })
  }
}
