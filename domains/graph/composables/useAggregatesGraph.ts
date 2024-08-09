import { useQueries } from '@tanstack/vue-query'

import type { AggregatesQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = AggregatesQuery

export function useAggregatesGraph() {
  return ({ profileAddress: _profileAddress }: FiltersProfileAssets) => {
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const profileAddress = unref(_profileAddress)

      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        profileAddress
          ? [
              {
                // 0
                queryKey: ['aggregates-graph', profileAddress, chainId],
                queryFn: async () => {
                  const result: QueryResult = await GqlAggregates({
                    address: profileAddress,
                  })

                  if (graphLog.enabled) {
                    graphLog('aggregates-raw', result)
                  }

                  return result as QueryResult
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
            ]
          : []
      ) as QFQueryOptions[] & AdditionalQueryOptions
      queries.profileAddress = profileAddress
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const data = results[0]?.data as QueryResult | undefined
        const {
          ownedAssets,
          ownedTokens,
          ownedCollectibles,
          createdAssets,
          createdTokens,
          createdCollectibles,
        } = data || {}
        const ownedAssetsCount = ownedAssets?.aggregate?.count || 0
        const ownedTokensCount = ownedTokens?.aggregate?.count || 0
        const ownedCollectiblesCount = ownedCollectibles?.aggregate?.count || 0

        const createdAssetsCount = createdAssets?.aggregate?.count || 0
        const createdTokensCount = createdTokens?.aggregate?.count || 0
        const createdCollectiblesCount =
          createdCollectibles?.aggregate?.count || 0

        const aggregates = {
          ownedAssetsCount,
          ownedTokensCount,
          ownedCollectiblesCount,
          createdAssetsCount,
          createdTokensCount,
          createdCollectiblesCount,
        }

        if (assetLog.enabled) {
          assetLog('aggregates', aggregates)
        }

        return aggregates
      },
    })
  }
}
