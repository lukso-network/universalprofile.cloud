import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import type { Image } from '@/types/image'
import type { LSP4DigitalAssetMetadata } from '@/types/asset'

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
                        console.log('fetching token data', tokenDataURL)
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
        if (
          token?.address.toLowerCase() ===
          '0x86E817172b5c07f7036Bf8aA46e2db9063743A83'.toLowerCase()
        ) {
          console.log(
            token,
            {
              owner,
              tokenCreators,
              decimals,
              forTokenData,
              baseURIData,
              lsp7Data,
            },
            results
              .slice(2, 5)
              .map(({ isLoading, failureReason, error, isError, data }) => ({
                isLoading,
                failureReason,
                isError,
                error,
                data,
              }))
          )
        }
        const metadataIsLoaded = results.slice(2, 5).every(result => {
          return !result.isLoading || result.failureReason != undefined
        })
        const tokenData: any = metadataIsLoaded
          ? lsp7Data ||
            baseURIData ||
            forTokenData || { LSP4Metadata: token.metadata }
          : undefined
        let tokenMetadata: LSP4DigitalAssetMetadata | undefined
        if (tokenData) {
          const links = tokenData.LSP4Metadata?.links
          const description = tokenData.LSP4Metadata?.description
          const attributes = tokenData.LSP4Metadata?.attributes
          const assets =
            tokenData?.LSP4Metadata?.assets?.map((asset: AssetMetadata) => {
              const { url } = asset as FileAsset

              // TODO add url verification check
              return url
                ? ({
                    ...asset,
                    src: url.startsWith('ipfs://') ? resolveUrl(url) : url,
                  } as AssetMetadata & { src: string })
                : asset
            }) || []
          const images =
            tokenData?.LSP4Metadata?.images?.map((images: any) => {
              return images.map((image: any) => {
                const { verification, url } = image
                return {
                  ...image,
                  src: url.startsWith('ipfs://')
                    ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                    : url,
                } as Image & { src: string }
              })
            }) || []
          const icon =
            tokenData?.LSP4Metadata?.icon?.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              } as Image & { src: string }
            }) || []
          tokenMetadata = {
            images,
            icon,
            attributes,
            description,
            links,
            assets,
          }
        }

        return {
          ...token,
          isLoading: results.some(result => result.isLoading),
          isAssetLoading: token.isLoading,
          isMetadataLoading: !metadataIsLoaded,
          tokenData,
          tokenMetadata,
          owner,
          tokenCreators,
          tokenMetadataRaw: {
            lsp7Data,
            baseURIData,
            forTokenData,
          },
          resolvedMetadata: tokenMetadata,
          decimals,
        } as Asset
      },
    })
  }
}
