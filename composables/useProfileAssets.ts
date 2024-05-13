import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import { LUKSO_PROXY_API } from '@/shared/config'

import type { Asset, ReferenceContract } from '@/types/asset'
import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { ProfileAssetsQuery } from '@/.nuxt/gql/default'
import { LSP4_TOKEN_TYPES } from '@lukso/lsp-smart-contracts'

type AdditionalQueryOptions = {
  receivedAssetCount: number
  allAddresses: Address[]
}

export function useProfileAssets() {
  return (_profileAddress?: MaybeRef<Address | null>) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const profile = useProfile().getProfile(
      _profileAddress as MaybeRef<Address>
    )
    const profileAddress = unref(_profileAddress)?.toLowerCase() as Address
    const isPending = ref(false)
    const queryClient = useQueryClient()

    const queries = computed(() => {
      const { value: { chainId } = { chainId: '' } } = currentNetwork
      const receivedAssetCount = profile?.value?.receivedAssets?.length || 0
      const allAddresses = ([] as `0x${string}`[]).concat(
        profile?.value?.receivedAssets || [],
        profile?.value?.issuedAssets || []
      )
      const queries: QFQueryOptions[] & AdditionalQueryOptions =
        allAddresses.flatMap((address: Address) => {
          return [
            queryCallContract({
              // 0
              chainId,
              address,
              method: 'tokenIdsOf(address)',
              args: [profileAddress],
              refetchInterval: 120_000,
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            }),
            queryCallContract({
              // 1
              chainId,
              address,
              method: 'balanceOf(address)',
              args: [profileAddress],
              refetchInterval: 120_000,
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            }),
            queryGetData({
              // 2
              chainId,
              address,
              keyName: 'LSP4TokenName',
              enabled: !isPending,
            }),
            queryGetData({
              // 3
              chainId,
              address,
              keyName: 'LSP4TokenSymbol',
              enabled: !isPending,
            }),
            queryGetData({
              // 4
              chainId,
              address,
              keyName: 'LSP4TokenType',
              enabled: !isPending,
            }),
            queryGetData({
              // 5
              chainId,
              address,
              keyName: 'LSP8TokenMetadataBaseURI',
              enabled: !isPending,
            }),
            queryGetData({
              // 6
              chainId,
              address,
              keyName: 'LSP8TokenIdFormat',
              enabled: !isPending,
            }),
            queryCallContract({
              // 7
              chainId,
              address,
              method: 'decimals()',
              enabled: !isPending,
            }),
            queryGetData({
              // 8
              chainId,
              address,
              keyName: 'LSP8ReferenceContract',
              enabled: !isPending,
            }),
            ...interfacesToCheck.map(({ interfaceId }) => {
              return queryCallContract({
                // 9+
                chainId,
                address,
                method: 'supportsInterface(bytes4)',
                args: [interfaceId],
                enabled: !isPending,
              })
            }),
          ]
        }) as QFQueryOptions[] & AdditionalQueryOptions
      queries.receivedAssetCount = receivedAssetCount
      queries.allAddresses = allAddresses
      return queries
    })

    // we call Graph to get all data before enabling RPC calls
    const { isPending: _isPending } = useQuery({
      queryKey: ['graph-profile-assets', profileAddress],
      queryFn: async () => {
        if (!profileAddress || !queries.value.length) {
          return {}
        }

        const { Hold: holds }: ProfileAssetsQuery = await GqlProfileAssets({
          profile: profileAddress,
        })

        if (graphLog.enabled) {
          graphLog('holds', holds)
        }

        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )

        for (let _assetIndex = 0; _assetIndex < holds.length; _assetIndex++) {
          const hold = holds[_assetIndex]
          const { asset, token } = hold
          const assetIndex =
            _assetIndex * (prefixLength + interfacesToCheck.length)

          // 0 tokenIdsOf(address)
          const tokenIdsKey = queries.value[assetIndex + 0].queryKey
          const tokenIds = asset
            ? []
            : holds
                .filter(
                  _hold => _hold?.token?.baseAsset?.id === token?.baseAsset?.id
                )
                .map(_hold => _hold?.token?.tokenId)
          queryClient.setQueryData(tokenIdsKey, tokenIds)

          // 2 LSP4TokenName
          const tokenNameKey = queries.value[assetIndex + 2].queryKey
          const tokenName = asset ? asset?.lsp4TokenName : token?.lsp4TokenName
          queryClient.setQueryData(tokenNameKey, tokenName)

          // 3 LSP4TokenSymbol
          const tokenSymbolKey = queries.value[assetIndex + 3].queryKey
          const tokenSymbol = asset
            ? asset?.lsp4TokenSymbol
            : token?.lsp4TokenSymbol
          queryClient.setQueryData(tokenSymbolKey, tokenSymbol)

          // 4 LSP4TokenType
          const tokenTypeKey = queries.value[assetIndex + 4].queryKey
          const tokenType = asset
            ? asset?.lsp4TokenType || LSP4_TOKEN_TYPES.TOKEN
            : token?.lsp4TokenType || LSP4_TOKEN_TYPES.NFT
          // console.log('graph', tokenType)
          queryClient.setQueryData(tokenTypeKey, tokenType)

          // 5 LSP8TokenMetadataBaseURI
          const tokenMetadataBaseURIKey = queries.value[assetIndex + 5].queryKey
          const tokenMetadataBaseURI = asset
            ? asset?.lsp8TokenMetadataBaseURI
            : token?.baseAsset?.lsp8TokenMetadataBaseURI
          queryClient.setQueryData(
            tokenMetadataBaseURIKey,
            tokenMetadataBaseURI
          )

          // 6 LSP8TokenIdFormat
          const tokenIdFormatKey = queries.value[assetIndex + 6].queryKey
          const tokenIdFormat = asset
            ? asset?.lsp8TokenIdFormat
            : token?.lsp8TokenIdFormat
          queryClient.setQueryData(tokenIdFormatKey, tokenIdFormat)

          // 7 decimals()
          const decimalsKey = queries.value[assetIndex + 7].queryKey
          const decimals = asset ? asset?.decimals : token?.baseAsset?.decimals
          queryClient.setQueryData(decimalsKey, decimals)

          // 8 LSP8ReferenceContract
          const referenceContractKey = queries.value[assetIndex + 8].queryKey
          const referenceContract = asset ? null : token?.baseAsset?.id
          queryClient.setQueryData(referenceContractKey, referenceContract)

          // 9+ supportsInterface(bytes4)
          interfacesToCheck.map(({ standard, interfaceId }, index) => {
            const supportsInterfaceKey =
              queries.value[assetIndex + index + prefixLength].queryKey
            const supportsInterface = asset
              ? asset?.standard === standard &&
                asset?.interfaces?.includes(interfaceId)
              : token?.baseAsset?.standard === standard &&
                token?.baseAsset?.interfaces?.includes(interfaceId)
            queryClient.setQueryData(supportsInterfaceKey, supportsInterface)
          })
        }

        return {}
      },
      staleTime: TANSTACK_GRAPH_STALE_TIME,
      enabled: computed(() => !!profileAddress),
    })

    isPending.value = _isPending.value

    return useQueries({
      queries,
      combine: results => {
        if (!profileAddress) {
          return
        }
        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )

        return (queries.value.allAddresses.flatMap((address, _assetIndex) => {
          const assetIndex =
            _assetIndex * (prefixLength + interfacesToCheck.length)
          const isIssued = _assetIndex >= queries.value.receivedAssetCount
          const tokenIds = results[assetIndex + 0].data as string[]
          const balance = results[assetIndex + 1].data as string
          const tokenName = results[assetIndex + 2].data as string
          const tokenSymbol = results[assetIndex + 3].data as string
          const tokenType = results[assetIndex + 4].data as number
          const baseURI = results[assetIndex + 5].data as any
          const tokenIdFormat = results[assetIndex + 6].data as number
          const decimals = (results[assetIndex + 7].data as number) || 0
          const rootReferenceContract = results[assetIndex + 8]
            .data as ReferenceContract
          const { supportsInterfaces, standard } = interfacesToCheck.reduce(
            (
              { supportsInterfaces, standard },
              { interfaceId, standard: _standard },
              index
            ) => {
              const supports = results[assetIndex + index + prefixLength]
                .data as boolean
              supportsInterfaces[interfaceId] = supports
              if (supports) {
                standard = _standard
              }
              return { supportsInterfaces, standard }
            },
            { supportsInterfaces: {}, standard: null } as {
              supportsInterfaces: Record<string, boolean>
              standard: Standard | null
            }
          )
          const isLoading = results.some(result => result.isLoading)
          let tokenIdsData: Asset[] | undefined

          if (tokenIds && tokenIds.length > 0) {
            tokenIdsData = tokenIds.map(tokenId => {
              let tokenURI = undefined
              let tokenDataURL = undefined
              try {
                switch (tokenIdFormat) {
                  case 0:
                    tokenURI = toNumber(tokenId).toString()
                    break
                  case 1:
                    tokenURI = encodeURI(hexToAscii(tokenId).replace(/\0/g, ''))
                    break
                  case 2:
                    tokenURI = tokenId.toLowerCase()
                    break
                  case 3:
                  case 4:
                    tokenURI = stripHexPrefix(tokenId).toLowerCase()
                    break
                }
              } catch {
                // Ignore
              }
              if (baseURI && tokenURI) {
                tokenDataURL = `${baseURI.url}${tokenURI}`.replace(
                  'ipfs://',
                  `${LUKSO_PROXY_API}/ipfs/`
                )
              }
              const asset = {
                isLoading,
                isOwned: !isIssued,
                isIssued,
                address,
                tokenURI,
                tokenIdFormat,
                rootReferenceContract,
                baseURI: toRaw(baseURI),
                tokenDataURL,
                decimals,
                tokenId,
                balance:
                  // for LSP8 we show balance as 1 not counting all tokenIds
                  standard && isLsp8({ standard }) && balance !== '0'
                    ? '1'
                    : balance,
                standard,
                tokenName,
                tokenSymbol,
                tokenType,
                supportsInterfaces,
              } as Asset
              if (!isLoading && assetLog.enabled) {
                assetLog('profile-asset', asset)
              }
              return asset
            })

            // when there is only 1 token id we just show it
            if (tokenIds.length === 1) {
              return tokenIdsData
            }
          }

          const asset = {
            isLoading,
            isOwned: !isIssued,
            isIssued,
            address,
            tokenIdFormat,
            rootReferenceContract,
            baseURI: toRaw(baseURI),
            balance:
              // for LSP8 we show balance as 1 not counting all tokenIds
              standard && isLsp8({ standard }) && balance !== '0'
                ? '1'
                : balance,
            standard,
            tokenName,
            tokenSymbol,
            tokenType,
            supportsInterfaces,
            decimals,
            tokenIdsData,
          } as Asset

          if (!isLoading && assetLog.enabled) {
            assetLog('profile-asset', asset)
          }

          return asset
        }) || []) as Asset[]
      },
    })
  }
}
