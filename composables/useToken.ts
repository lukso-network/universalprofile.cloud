import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import type { Image } from '@/types/image'
import type { ExtendedAssetMetadata } from '@/types/asset'

export function useToken() {
  return (token: Asset | undefined) => {
    const tokenId = token?.tokenId
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: undefined } } = currentNetwork
    const queries = token?.address
      ? [
          {
            // 0
            queryKey: ['call', chainId, token?.address, 'owner()'],
          },
          {
            // 1
            queryKey: ['call', chainId, token?.address, 'creator()'],
          },
          {
            // 2
            queryKey: ['data', chainId, token?.address, 'LSP4Creators[]'],
          },
          {
            // 3
            queryKey: ['call', chainId, token?.address, 'decimals()'],
          },
          ...(tokenId
            ? [
                {
                  // 4
                  queryKey: [
                    'tokenDataBig',
                    chainId,
                    token?.address,
                    tokenId,
                    'LSP4Metadata',
                  ],
                },
                {
                  // 5
                  queryKey: ['tokenJSON', chainId, token?.address, tokenId],
                  queryFn: async () => {
                    if (token.tokenDataURL) {
                      const url = token.tokenDataURL.replace(
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
                          throw error
                        })
                    }
                    return null
                  },
                },
                ...(tokenId && token.tokenIdFormat === 2
                  ? [
                      {
                        // 6
                        queryKey: [
                          'dataBig',
                          chainId,
                          ABICoder.decodeParameter(
                            'address',
                            tokenId
                          ).toLowerCase(),
                          'LSP4Metadata',
                        ],
                      },
                    ]
                  : []),
              ]
            : []),
        ]
      : []
    return useQueries({
      queries,
      combine: results => {
        if (!token) {
          return null
        }
        const owner = results[0].data as string
        const creator = results[1].data as string
        const tokenCreators = results[2].data as string[]
        const decimals = results[3]?.data as number
        const forTokenData = results[4]?.data as any
        const baseURIData = results[5]?.data as any
        const lsp7Data = results[6]?.data as any
        const tokenData: any = lsp7Data || baseURIData || forTokenData
        let tokenMetadata: ExtendedAssetMetadata | undefined
        if (tokenData) {
          const links = tokenData.LSP4Metadata?.links
          const description = tokenData.LSP4Metadata?.description
          const attributes = tokenData.LSP4Metadata?.attributes
          const assets =
            tokenData?.LSP7Metadata?.assets.map((asset: AssetMetadata) => {
              const { verification, url } = asset as FileAsset

              return url
                ? ({
                    ...asset,
                    src: url.startsWith('ipfs://')
                      ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                      : url,
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
          tokenData,
          tokenMetadata,
          owner,
          creator,
          tokenCreators,
          decimals,
          get resolvedMetadata() {
            return tokenMetadata || token.metadata
          },
        } as Asset
      },
    })
  }
}
