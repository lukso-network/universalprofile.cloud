import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import type { Asset } from '@/types/asset'
import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { TokenQuery } from '@/.nuxt/gql/default'

type AdditionalQueryOptions = {
  address: Address | undefined
  tokenId: string | undefined
}

export function useAsset() {
  return (
    _address?: MaybeRef<Address | undefined>,
    _tokenId?: MaybeRef<string | undefined>
  ) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const chainId = currentNetwork.value?.chainId || ''
    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = computed(() => connectedProfile.value?.address)
    const isPending = ref(false)
    const queryClient = useQueryClient()

    const queries = computed(() => {
      const tokenId = unref(_tokenId)
      const address = unref(_address)
      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        address
          ? [
              queryGetData({
                // 0
                chainId,
                address,
                keyName: 'LSP4TokenName',
                enabled: !isPending,
              }),
              queryGetData({
                // 1
                chainId,
                address,
                keyName: 'LSP4TokenSymbol',
                enabled: !isPending,
              }),
              queryGetData({
                // 2
                chainId,
                address,
                keyName: 'LSP4TokenType',
                enabled: !isPending,
              }),
              queryGetData({
                // 3
                chainId,
                address,
                keyName: 'LSP8TokenMetadataBaseURI',
                enabled: !isPending,
              }),
              queryGetData({
                // 4
                chainId,
                address,
                keyName: 'LSP8TokenIdFormat',
                enabled: !isPending,
              }),
              queryCallContract({
                // 5
                chainId,
                address,
                method: 'totalSupply()',
                enabled: !isPending,
              }),
              profileAddress.value
                ? queryCallContract({
                    // 6
                    chainId,
                    address,
                    method: 'balanceOf(address)',
                    args: [profileAddress.value],
                    staleTime: isPending.value
                      ? TANSTACK_DEFAULT_STALE_TIME
                      : 250,
                    enabled: !isPending,
                  })
                : queryNull(),
              ...interfacesToCheck.map(({ interfaceId }) => {
                return queryCallContract({
                  // 7+
                  chainId,
                  address: address || '0x0',
                  method: 'supportsInterface(bytes4)',
                  args: [interfaceId],
                  enabled: !isPending,
                })
              }),
            ]
          : []
      ) as QFQueryOptions[] & AdditionalQueryOptions
      queries.tokenId = tokenId
      queries.address = address
      return queries
    })

    const tokenId = unref(_tokenId)
    const address = unref(_address)?.toLowerCase() as Address | undefined
    const { isPending: _isPending } = useQuery({
      queryKey: ['graph-asset', address, tokenId],
      queryFn: async () => {
        if (!address) {
          return
        }

        const { Asset: assets }: TokenQuery = await GqlToken({
          address,
          tokenId: tokenId || '',
        })

        const [asset] = assets // since we use `where` in query we pick first asset

        if (!asset) {
          return {}
        }

        const [token] = asset.tokens // since we use `where` in query we pick first token

        // 0 LSP4TokenName
        const tokenNameKey = queries.value[0].queryKey
        const tokenName = asset ? asset?.lsp4TokenName : token?.lsp4TokenName
        queryClient.setQueryData(tokenNameKey, tokenName)

        // 1 LSP4TokenSymbol
        const tokenSymbolKey = queries.value[1].queryKey
        const tokenSymbol = token
          ? token?.lsp4TokenSymbol
          : asset?.lsp4TokenSymbol
        queryClient.setQueryData(tokenSymbolKey, tokenSymbol)

        // 2 LSP4TokenType
        const tokenTypeKey = queries.value[2].queryKey
        const tokenType = token ? token?.lsp4TokenType : asset?.lsp4TokenType
        queryClient.setQueryData(tokenTypeKey, tokenType)

        // 3 LSP8TokenMetadataBaseURI
        const tokenMetadataBaseURIKey = queries.value[3].queryKey
        const tokenMetadataBaseURI = token
          ? token.baseAsset?.lsp8TokenMetadataBaseURI
          : asset?.lsp8TokenMetadataBaseURI
        queryClient.setQueryData(tokenMetadataBaseURIKey, tokenMetadataBaseURI)

        // 4 LSP8TokenIdFormat
        const tokenIdFormatKey = queries.value[4].queryKey
        const tokenIdFormat = token
          ? token.baseAsset?.lsp8TokenIdFormat
          : asset?.lsp8TokenIdFormat
        queryClient.setQueryData(tokenIdFormatKey, tokenIdFormat)

        // 5 totalSupply
        // const totalSupplyKey = queries.value[5].queryKey
        // const totalSupply = asset ? asset?.totalSupply : token?.totalSupply
        // queryClient.setQueryData(totalSupplyKey, totalSupply)

        // 7+ supportsInterface(bytes4)
        interfacesToCheck.map(({ standard, interfaceId }, index) => {
          const supportsInterfaceKey = queries.value[7 + index].queryKey
          const supportsInterface =
            asset?.standard === standard &&
            asset?.interfaces?.includes(interfaceId)
          queryClient.setQueryData(supportsInterfaceKey, supportsInterface)
        })

        return {}
      },
      staleTime: TANSTACK_GRAPH_STALE_TIME,
      enabled: computed(() => !!address && queries.value.length > 0),
    })

    isPending.value = _isPending.value

    return useQueries({
      queries,
      combine: results => {
        if (results.length === 0) {
          return { isLoading: true } as Asset
        }

        const tokenId = queries.value.tokenId
        const address = queries.value.address
        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )
        const isLoading = results.some(result => result.isLoading)
        const tokenName = results[0].data as string
        const tokenSymbol = results[1].data as string
        const tokenType = results[2].data as number
        const baseURI = results[3].data as any
        const tokenIdFormat = results[4].data as number
        const totalSupply = results[5].data as string
        const { supportsInterfaces, standard } = interfacesToCheck.reduce(
          (
            { supportsInterfaces, standard },
            { interfaceId, standard: _standard },
            index
          ) => {
            const supports = results[index + prefixLength].data as boolean
            supportsInterfaces[interfaceId] = supports
            if (supports) {
              standard = _standard
            }
            return { supportsInterfaces, standard }
          },
          { supportsInterfaces: {}, standard: null } as {
            supportsInterfaces: Record<string, boolean>
            standard: string | null
          }
        )
        const balance = profileAddress.value
          ? (results[6].data as string)
          : null
        if (tokenId) {
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
            address,
            tokenURI,
            tokenIdFormat,
            baseURI,
            tokenDataURL,
            totalSupply,
            tokenId,
            balance,
            standard,
            tokenName,
            tokenSymbol,
            tokenType,
            supportsInterfaces,
          } as Asset
          if (!isLoading && assetLog.enabled) {
            assetLog('token', asset)
          }
          return asset
        }

        const asset = {
          isLoading,
          address,
          tokenIdFormat,
          totalSupply,
          baseURI,
          balance,
          standard,
          tokenName,
          tokenSymbol,
          tokenType,
          supportsInterfaces,
        } as Asset
        if (!isLoading && assetLog.enabled) {
          assetLog('collection', asset)
        }
        return asset
      },
    })
  }
}
