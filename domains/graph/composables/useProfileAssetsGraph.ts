import { useQueries } from '@tanstack/vue-query'

import type { ProfileAssetsQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = ProfileAssetsQuery
type QueryResultProfile = ProfileAssetsQuery['Profile']
type QueryResultHolds = ProfileAssetsQuery['Profile'][0]['holds']

export function useProfileAssetsGraph() {
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
                queryKey: ['profile-assets-graph', profileAddress, chainId],
                queryFn: async () => {
                  const { Profile: profiles }: QueryResult =
                    await GqlProfileAssets({
                      address: profileAddress,
                    })

                  if (graphLog.enabled) {
                    graphLog('profile-assets', profiles)
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

        const {
          receivedAssets: lsp5ReceivedAssets,
          holds,
          lsp12IssuedAssets,
        } = profilesData || {}

        const receivedAssets =
          lsp5ReceivedAssets?.flatMap(receivedAsset => {
            const tokenIdsData: Asset[] = []

            if (receivedAsset.asset?.standard === STANDARDS.LSP8) {
              holds?.filter(hold => {
                if (hold.token?.baseAsset?.id === receivedAsset.asset?.id) {
                  tokenIdsData.push({
                    ...createAssetObject(
                      receivedAsset.asset,
                      hold?.token,
                      [],
                      hold.balance,
                      hold.token?.tokenId
                    ),
                    isOwned: true,
                    isIssued: false,
                  })
                }
              })
            }

            if (tokenIdsData.length === 1) {
              return tokenIdsData
            }

            return {
              ...createAssetObject(
                receivedAsset.asset,
                receivedAsset.asset,
                tokenIdsData,
                getBalanceForHold(holds, receivedAsset?.asset?.id) || '0'
              ),
              isOwned: true,
              isIssued: false,
            }
          }) || []

        const issuedAssets =
          lsp12IssuedAssets?.flatMap(issuedAsset => {
            return {
              ...createAssetObject(
                issuedAsset.asset,
                issuedAsset.asset,
                [],
                getBalanceForHold(holds, issuedAsset?.asset?.id) || '0'
              ),
              isOwned: false,
              isIssued: true,
            }
          }) || []

        if (graphLog.enabled) {
          graphLog('profile-assets', [...receivedAssets, ...issuedAssets])
        }

        return [...receivedAssets, ...issuedAssets]
      },
    })
  }
}

const getBalanceForHold = (holds?: QueryResultHolds, _address?: string) => {
  const address = _address?.toLowerCase()
  return holds?.find(
    hold =>
      hold?.asset?.id.toLowerCase() === address ||
      hold?.token?.baseAsset?.id.toLowerCase() === address
  )?.balance
}