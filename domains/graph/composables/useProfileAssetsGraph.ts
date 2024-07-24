import { useQueries } from '@tanstack/vue-query'

import type { ProfileAssetsQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = ProfileAssetsQuery

export function useProfileAssetsGraph() {
  return ({ profileAddress: _profileAddress }: FiltersProfileAssets) => {
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const profileAddress = unref(_profileAddress)

      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        profileAddress
          ? [
              {
                // 0
                queryKey: ['profile-assets-graph', profileAddress, chainId],
                queryFn: async () => {
                  const { receivedAssets, issuedAssets, holds }: QueryResult =
                    await GqlProfileAssets({
                      address: profileAddress,
                    })

                  if (graphLog.enabled) {
                    graphLog(
                      'profile-assets-raw',
                      receivedAssets,
                      issuedAssets,
                      holds
                    )
                  }

                  return {
                    receivedAssets,
                    issuedAssets,
                    holds,
                  }
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
        const holdsData = data?.holds as QueryResult['holds'] | undefined
        const receivedAssetsData = data?.receivedAssets as
          | QueryResult['receivedAssets']
          | undefined
        const issuedAssetsData = data?.issuedAssets as
          | QueryResult['issuedAssets']
          | undefined
        const isLoading = results.some(result => result.isLoading)

        const receivedAssets =
          receivedAssetsData?.flatMap(receivedAsset => {
            const tokenIdsData: Asset[] = []

            if (receivedAsset.asset?.standard === STANDARDS.LSP8) {
              holdsData?.filter(hold => {
                if (hold.token?.baseAsset?.id === receivedAsset.asset?.id) {
                  tokenIdsData.push({
                    ...createAssetObject(
                      receivedAsset.asset,
                      hold?.token,
                      [],
                      getBalance(hold)
                    ),
                    isOwned: true,
                    isIssued: false,
                    isLoading,
                    isMetadataLoading: isLoading,
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
                null,
                tokenIdsData,
                getBalanceForHold(holdsData, receivedAsset?.asset?.id) || '0'
              ),
              isOwned: true,
              isIssued: false,
              isLoading,
              isMetadataLoading: isLoading,
            }
          }) || []

        const issuedAssets =
          issuedAssetsData?.flatMap(issuedAsset => {
            return {
              ...createAssetObject(
                issuedAsset.asset,
                null,
                [],
                getBalanceForHold(holdsData, issuedAsset?.asset?.id) || '0'
              ),
              isOwned: false,
              isIssued: true,
            }
          }) || []

        if (assetLog.enabled) {
          assetLog('profile-assets', [...receivedAssets, ...issuedAssets])
        }

        return [...receivedAssets, ...issuedAssets]
      },
    })
  }
}

const getBalanceForHold = (holds?: QueryResult['holds'], _address?: string) => {
  const address = _address?.toLowerCase()
  return holds?.find(
    hold =>
      hold?.asset?.id.toLowerCase() === address ||
      hold?.token?.baseAsset?.id.toLowerCase() === address
  )?.balance
}
