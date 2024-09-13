import { useQueries } from '@tanstack/vue-query'

import type { AssetQuery } from '@/.nuxt/gql/default'

type QueryResult = AssetQuery

export function useAssetGraph() {
  return (
    _assetAddress?: MaybeRef<Address | undefined>,
    _tokenId?: MaybeRef<string | undefined>
  ) => {
    const connectedProfile = useProfile().connectedProfile()
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const assetAddress = unref(_assetAddress) || ''
      const profileAddress = connectedProfile.value?.address || ''
      const tokenId: string = unref(_tokenId) || ''

      const queries = assetAddress
        ? [
            {
              // 0
              queryKey: [
                'asset-graph',
                assetAddress,
                chainId,
                tokenId,
                profileAddress,
              ],
              queryFn: async () => {
                const queryResult: QueryResult = await GqlAsset({
                  assetAddress,
                  profileAddress,
                  tokenId,
                })

                if (graphLog.enabled) {
                  graphLog('asset-raw', queryResult)
                }

                return queryResult
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
        const data = results[0]?.data as QueryResult | undefined
        const assetData = data?.asset?.[0]
        const tokenData = data?.token?.[0]
        const holdData = data?.hold
        const isLoading = !results.length
          ? true
          : results?.some(result => result.isLoading)
        const tokenIdsData: Asset[] = []

        if (assetData?.standard === STANDARDS.LSP8) {
          holdData?.filter(hold => {
            if (hold.token?.baseAsset?.id === assetData?.id) {
              tokenIdsData.push({
                ...createAssetObject(
                  assetData,
                  hold?.token,
                  [],
                  getBalance(hold)
                ),
                isOwned: true,
                isIssued: false,
              })
            }
          })
        }
        const asset = {
          ...createAssetObject(
            assetData,
            tokenData,
            tokenIdsData,
            getBalance(holdData?.[0])
          ),
          isLoading,
          isMetadataLoading: isLoading,
        }

        if (assetLog.enabled) {
          assetLog('asset', asset)
        }

        return asset
      },
    })
  }
}
