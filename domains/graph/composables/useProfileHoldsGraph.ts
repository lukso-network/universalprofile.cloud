import { useQueries } from '@tanstack/vue-query'

import type { ProfileHoldsQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = ProfileHoldsQuery
type QueryResultProfile = ProfileHoldsQuery['profiles']

export function useProfileHoldsGraph() {
  return ({ profileAddress: _profileAddress }: FiltersProfileAssets) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: '' } } = currentNetwork

    const queries = computed(() => {
      const profileAddress = unref(_profileAddress)

      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        profileAddress
          ? [
              {
                // 0
                queryKey: ['profile-holds-graph', profileAddress, chainId],
                queryFn: async () => {
                  const { profiles }: QueryResult = await GqlProfileHolds({
                    address: profileAddress,
                  })

                  if (graphLog.enabled) {
                    graphLog('profile-holds', profiles)
                  }

                  return profiles as QueryResultProfile
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
        const data = results[0]?.data as QueryResultProfile | undefined

        const profilesData = data?.[0]

        const { holds } = profilesData || {}

        const holdsAssets = holds?.flatMap(hold => {
          return {
            ...createAssetObject(
              hold.asset,
              hold?.token,
              [],
              hold.balance,
              hold.token?.tokenId
            ),
            isOwned: true,
          }
        })

        if (graphLog.enabled) {
          graphLog('profile-holds', holdsAssets)
        }

        return holdsAssets
      },
    })
  }
}
