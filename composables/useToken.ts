import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import type {
  LSP4DigitalAssetMetadata,
  LSP4DigitalAssetMetadataJSON,
} from '@/types/asset'

export function useToken() {
  return (_token?: MaybeRef<Asset | null | undefined>) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: '' } } = currentNetwork
    const queries = computed(() => {
      const token: Asset | null = isRef(_token)
        ? _token.value || null
        : _token || null
      const { address, tokenId, isLoading, tokenDataURL, tokenIdFormat } =
        token || {}
      return address && !isLoading
        ? [
            queryCallContract({
              // 0
              chainId,
              address,
              method: 'owner()',
            }),
            queryGetData({
              // 1
              chainId,
              address,
              keyName: 'LSP4Creators[]',
            }),
            queryCallContract({
              // 2
              chainId,
              address,
              method: 'decimals()',
            }),
            ...(tokenId
              ? [
                  queryGetData({
                    // 3
                    chainId,
                    address,
                    tokenId,
                    keyName: 'LSP4Metadata',
                    isBig: true,
                  }),
                  {
                    // 4
                    queryKey: [
                      'tokenJSON',
                      chainId,
                      token?.address,
                      tokenId,
                      tokenDataURL,
                    ],
                    queryFn: async () => {
                      if (tokenDataURL) {
                        const url = tokenDataURL.replace(
                          /^ipfs:\/\//,
                          'https://api.universalprofile.cloud/ipfs/'
                        )
                        return await fetch(url)
                          .then(response => {
                            if (!response.ok) {
                              throw new Error('Unable to fetch')
                            }
                            return response.json()
                          })
                          .catch(error => {
                            console.error('Error fetching token data', error)
                            throw error
                          })
                      }
                      return null
                    },
                  },
                  ...(tokenId && tokenIdFormat === 2
                    ? [
                        queryGetData({
                          // 5
                          chainId,
                          address: ABICoder.decodeParameter(
                            'address',
                            tokenId
                          ).toLowerCase() as Address,
                          keyName: 'LSP4Metadata',
                          isBig: true,
                        }),
                      ]
                    : []),
                ]
              : []),
          ]
        : []
    })
    return useQueries({
      queries,
      combine: results => {
        const token: Asset | null = isRef(_token)
          ? _token.value || null
          : _token || null
        if (!token || !token?.address || token?.isLoading) {
          return null
        }
        const owner = results[0].data as string
        const tokenCreators = results[1].data as string[]
        const decimals = parseInt((results[2].data as string) || '0')
        const forTokenData = results[3]?.data as any
        const baseURIData = results[4]?.data as any
        const lsp7Data = results[5]?.data as any
        const metadataIsLoaded = results.slice(2, 5).every(result => {
          return !result.isLoading || result.failureReason != undefined
        })
        const tokenMetadata = { LSP4Metadata: token.resolvedMetadata }
        const tokenData: LSP4DigitalAssetMetadataJSON = metadataIsLoaded
          ? lsp7Data || baseURIData || forTokenData || tokenMetadata
          : undefined
        let resolvedMetadata: LSP4DigitalAssetMetadata | undefined
        if (tokenData) {
          resolvedMetadata = prepareMetadata(tokenData)
        }

        return {
          ...token,
          isLoading: results.some(result => result.isLoading),
          isAssetLoading: token.isLoading,
          isMetadataLoading: !metadataIsLoaded,
          owner,
          tokenCreators,
          rawMetadata: {
            lsp7Data,
            baseURIData,
            forTokenData,
            tokenMetadata,
          },
          resolvedMetadata,
          decimals,
        } as Asset
      },
    })
  }
}
