import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import { Priorities, type QFQueryOptions } from '@/utils/queryFunctions'

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
      const { address, tokenId, tokenDataURL, tokenIdFormat } = token || {}
      const queries: QFQueryOptions[] & { token: Asset | null } = (
        address
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
              queryGetData({
                // 3
                chainId,
                address,
                tokenId,
                keyName: 'LSP4Creators[]',
              }),
              queryGetData({
                // 4
                chainId,
                address,
                keyName: 'LSP4Metadata',
                aggregateLimit: 1,
                priority: Priorities.Low,
              }),
              ...(tokenId
                ? [
                    queryGetData({
                      // 5
                      chainId,
                      address,
                      tokenId,
                      keyName: 'LSP4Metadata',
                      aggregateLimit: 1,
                      priority: Priorities.Low,
                    }),
                    {
                      // 6
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
                            // 7
                            chainId,
                            address: ABICoder.decodeParameter(
                              'address',
                              tokenId
                            ).toLowerCase() as Address,
                            keyName: 'LSP4Metadata',
                            aggregateLimit: 1,
                            priority: Priorities.Low,
                          }),
                          queryGetData({
                            // 8
                            chainId,
                            address: ABICoder.decodeParameter(
                              'address',
                              tokenId
                            ).toLowerCase() as Address,
                            keyName: 'LSP8ReferenceContract',
                          }),
                          queryGetData({
                            // 9
                            chainId,
                            address: ABICoder.decodeParameter(
                              'address',
                              tokenId
                            ).toLowerCase() as Address,
                            keyName: 'LSP4Creators[]',
                          }),
                        ]
                      : [
                          queryGetData({
                            // 7
                            chainId,
                            address,
                            tokenId,
                            keyName: 'LSP4Creators[]',
                          }),
                        ]),
                  ]
                : []),
            ]
          : []
      ) as QFQueryOptions[] & { token: Asset | null }
      queries.token = token
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const token: Asset | null = queries.value.token as Asset
        if (!token) {
          return null
        }

        if (results.length === 0) {
          return { isLoading: true } as Asset
        }

        const isLoading =
          token.isLoading ||
          results.some((result, index) =>
            index >= 3 && index < 7 ? false : result.isLoading
          )

        const { tokenId, tokenIdFormat } = token

        const owner = results[0].data as string
        const tokenCreators = results[1].data as string[]
        const decimals = Number.parseInt((results[2].data as string) || '0')
        const tokenIdCreatorsCount = results[3]?.data || 0
        const lsp7Creators =
          tokenId && tokenIdFormat === 2
            ? results[9]?.data
            : (results[7]?.data as any[])
        const _assetData = results[4]?.data as any
        const forTokenData = results[5]?.data as any
        const baseURIData = results[6]?.data as any
        const lsp7Data =
          tokenId && tokenIdFormat === 2 ? (results[7]?.data as any) : null
        const referenceContract = results[8]?.data as any
        const metadataIsLoaded = results
          .slice(4, tokenId && tokenIdFormat === 2 ? 8 : 7)
          .every(result => {
            return !result.isLoading || result.failureReason != undefined
          })
        const tokenData: LSP4DigitalAssetMetadataJSON = metadataIsLoaded
          ? lsp7Data || forTokenData || baseURIData || _assetData
          : undefined
        let resolvedMetadata: LSP4DigitalAssetMetadata | undefined
        let assetData: LSP4DigitalAssetMetadata | undefined
        if (tokenData) {
          resolvedMetadata = prepareMetadata(tokenData)
        }
        if (_assetData) {
          assetData = prepareMetadata(_assetData)
        }
        return {
          ...token,
          isLoading,
          isAssetLoading: token.isLoading,
          isMetadataLoading: !metadataIsLoaded,
          owner,
          tokenCreators,
          tokenIdCreatorsCount,
          lsp7Creators,
          rawMetadata: {
            lsp7Data,
            baseURIData,
            forTokenData,
            assetData,
          },
          assetData,
          resolvedMetadata,
          referenceContract,
          decimals,
          tokenName: resolvedMetadata?.name
            ? resolvedMetadata?.name
            : token.tokenName,
        } as Asset
      },
    })
  }
}
