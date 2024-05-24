import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'
import { keccak256 } from 'web3-utils'
import { LSP8_TOKEN_ID_FORMAT } from '@lukso/lsp-smart-contracts'

import { browserProcessMetadata } from '@/utils/processMetadata'
import {
  Priorities,
  type QFQueryOptions,
  queryNull,
} from '@/utils/queryFunctions'

import type {
  LSP4DigitalAssetMetadata,
  LSP4DigitalAssetMetadataJSON,
} from '@/types/asset'
import type { TokenQuery } from '@/.nuxt/gql/default'

type AdditionalQueryOptions = { token?: Asset | null }

export function useToken() {
  return (_token?: MaybeRef<Asset | null | undefined>) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const chainId = currentNetwork.value?.chainId || ''
    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = computed(() =>
      connectedProfile.value?.address?.toLowerCase()
    )
    const isPending = ref(false)
    const queryClient = useQueryClient()

    const queries = computed(() => {
      const token = unref(_token)
      const { tokenId, tokenDataURL, tokenIdFormat } = token || {}
      const address = token?.address?.toLowerCase() as Address | undefined
      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        address
          ? [
              queryCallContract({
                // 0
                chainId,
                address,
                method: 'owner()',
                enabled: !isPending,
              }),
              queryGetData({
                // 1
                chainId,
                address,
                keyName: 'LSP4Creators[]',
                enabled: !isPending,
              }),
              queryCallContract({
                // 2
                chainId,
                address,
                method: 'decimals()',
                enabled: !isPending,
              }),
              queryCallContract({
                // 3
                chainId,
                address,
                method: 'tokenIdsOf(address)',
                args: [profileAddress.value],
                staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
                enabled: !isPending,
              }),
              tokenId && tokenIdFormat === LSP8_TOKEN_ID_FORMAT.ADDRESS
                ? queryGetData({
                    // 4
                    chainId,
                    address: ABICoder.decodeParameter(
                      'address',
                      tokenId
                    ).toLowerCase() as Address,
                    keyName: 'LSP8ReferenceContract',
                    enabled: !isPending,
                  })
                : queryNull(),
              tokenId && tokenIdFormat === LSP8_TOKEN_ID_FORMAT.ADDRESS
                ? queryGetData({
                    // 5
                    chainId,
                    address: ABICoder.decodeParameter(
                      'address',
                      tokenId
                    ).toLowerCase() as Address,
                    keyName: 'LSP4Creators[]',
                    enabled: !isPending,
                  })
                : queryNull(),
              queryGetData({
                // 6
                chainId,
                address,
                keyName: 'LSP4Metadata',
                process: data => browserProcessMetadata(data, keccak256),
                aggregateLimit: 1,
                priority: Priorities.Low,
                enabled: !isPending,
              }),
              tokenId
                ? queryGetData({
                    // 7
                    chainId,
                    address,
                    tokenId,
                    keyName: 'LSP4Metadata',
                    process: data => browserProcessMetadata(data, keccak256),
                    aggregateLimit: 1,
                    priority: Priorities.Low,
                    enabled: !isPending,
                  })
                : queryNull(),
              tokenId
                ? {
                    // 8
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
                          `${LUKSO_PROXY_API}/ipfs/`
                        )
                        return await fetch(url, { redirect: 'follow' })
                          .then(response => {
                            if (!response.ok) {
                              throw new Error('Unable to fetch')
                            }
                            return response.json()
                          })
                          .then(async data => {
                            return await browserProcessMetadata(data, keccak256)
                          })
                          .catch(error => {
                            console.error('Error fetching token data', error)
                            throw error
                          })
                      }
                      return null
                    },
                    enabled: !isPending,
                  }
                : queryNull(),
              tokenId && tokenIdFormat === LSP8_TOKEN_ID_FORMAT.ADDRESS
                ? queryGetData({
                    // 9
                    chainId,
                    address: ABICoder.decodeParameter(
                      'address',
                      tokenId
                    ).toLowerCase() as Address,
                    keyName: 'LSP4Metadata',
                    process: data => browserProcessMetadata(data, keccak256),
                    aggregateLimit: 1,
                    priority: Priorities.Low,
                    enabled: !isPending,
                  })
                : queryNull(),
            ]
          : []
      ) as QFQueryOptions[] & AdditionalQueryOptions
      queries.token = token
      return queries
    })

    const token = unref(_token)
    const { tokenId, tokenIdFormat } = token || {}
    const address = token?.address?.toLowerCase() as Address | undefined
    const { isPending: _isPending } = useQuery({
      queryKey: ['graph-token', address, tokenId],
      queryFn: async () => {
        if (!address) {
          return
        }

        const { Asset: assets }: TokenQuery = await GqlToken({
          address,
          tokenId: tokenId || '',
        })

        if (graphLog.enabled) {
          graphLog('token', assets)
        }

        const [asset] = assets // since we use `where` in query we pick first asset
        const [token] = asset.tokens // since we use `where` in query we pick first token

        // 0 owner
        const ownerKey = queries.value[0].queryKey
        const owner = asset?.owner?.id
        queryClient.setQueryData(ownerKey, owner)

        // 1 LSP4Creators[]
        const tokenCreatorsKey = queries.value[1].queryKey
        const tokenCreators = asset?.lsp4Creators?.map(
          creator => creator?.profile?.id
        )
        queryClient.setQueryData(tokenCreatorsKey, tokenCreators)

        // 2 decimals
        const decimalsKey = queries.value[2].queryKey
        const decimals = asset?.decimals
        queryClient.setQueryData(decimalsKey, decimals)

        // 3 tokenIdsOf(address)
        const tokenIdsOfKey = queries.value[3].queryKey
        const tokenIdsOf = asset?.tokens.map(token => token.tokenId)
        queryClient.setQueryData(tokenIdsOfKey, tokenIdsOf)

        // 4 LSP8ReferenceContract
        // TODO

        // 5 LSP4Creators[]
        // TODO

        // 6 LSP4Metadata
        const assetMetadataKey = queries.value[6].queryKey
        const assetMetadata = {
          LSP4Metadata: {
            name: asset?.name,
            description: asset?.description,
            links: asset?.links,
            icon: asset?.icons,
            images: unflatArray(asset?.images),
            assets: asset?.assets,
            attributes: asset?.attributes,
          },
        }
        queryClient.setQueryData(assetMetadataKey, assetMetadata)

        // 7 LSP4Metadata for token id
        if (tokenId) {
          const tokenMetadataKey = queries.value[7].queryKey
          const tokenMetadata = {
            LSP4Metadata: {
              name: token?.name,
              description: token?.description,
              links: token?.links,
              icon: token?.icons,
              images: unflatArray(token?.images),
              assets: token?.assets,
              attributes: token?.attributes,
            },
          }
          queryClient.setQueryData(tokenMetadataKey, tokenMetadata)
        }

        // 8 lsp8TokenMetadataBaseURI
        if (tokenId) {
          const lsp8TokenMetadataBaseURIKey = queries.value[8].queryKey
          const lsp8TokenMetadataBaseURI =
            token?.baseAsset?.lsp8TokenMetadataBaseURI
          queryClient.setQueryData(
            lsp8TokenMetadataBaseURIKey,
            lsp8TokenMetadataBaseURI
          )
        }

        // 9 LSP4Metadata base URI
        if (tokenId && tokenIdFormat === LSP8_TOKEN_ID_FORMAT.ADDRESS) {
          const tokenMetadataKey = queries.value[9].queryKey
          const tokenMetadata = {
            LSP4Metadata: {
              name: token?.name,
              description: token?.description,
              links: token?.links,
              icon: token?.icons,
              images: unflatArray(token?.images),
              assets: token?.assets,
              attributes: token?.attributes,
            },
          }
          queryClient.setQueryData(tokenMetadataKey, tokenMetadata)
        }

        return {}
      },
      staleTime: TANSTACK_GRAPH_STALE_TIME,
      enabled: computed(() => !!address && queries.value.length > 0),
    })

    isPending.value = _isPending.value

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

        const resultsWithQuery = results.map((result, index) => {
          const query = queries.value[index]
          return { result, query }
        })
        const metadataResults = resultsWithQuery.slice(6)
        const nonMetadataResults = resultsWithQuery.slice(0, 6)
        const isLoading =
          token.isLoading ||
          nonMetadataResults.some(({ result }) => result.isLoading)

        const owner = results[0].data as string
        const tokenCreators = results[1].data as string[]
        const decimals = Number.parseInt((results[2].data as string) || '0')
        const tokenIdCreatorsCount = results[3]?.data || 0
        const tokenIdsOf = results[3]?.data as string[]
        const referenceContract = results[4]?.data as any
        const lsp7Creators = results[5]?.data as Address[]

        const _assetData = results[6]?.data as any
        const forTokenData = results[7]?.data as any
        const baseURIData = results[8]?.data as any
        const lsp7Data = results[9]?.data as any
        const isMetadataLoading = metadataResults.some(({ result }) => {
          return result.isLoading
        })
        const tokenData: LSP4DigitalAssetMetadataJSON = !isMetadataLoading
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

        const asset = {
          ...token,
          isLoading,
          isAssetLoading: token.isLoading,
          isMetadataLoading,
          owner,
          tokenCreators,
          tokenIdCreatorsCount,
          tokenIdsOf,
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
        if (!isLoading && tokenLog.enabled) {
          tokenLog('token', asset)
        }
        return asset
      },
    })
  }
}
