import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import type { Image } from '@/types/image'
import type { LSP4DigitalAssetMetadata } from '@/types/asset'

export function useToken() {
  return (token?: Asset | null) => {
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
            queryKey: ['data', chainId, token?.address, 'LSP4Creators[]'],
          },
          ...(tokenId
            ? [
                {
                  // 2
                  queryKey: [
                    'tokenDataBig',
                    chainId,
                    token?.address,
                    tokenId,
                    'LSP4Metadata',
                  ],
                },
                {
                  // 3
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
                        // 4
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
        const tokenCreators = results[1].data as string[]
        const forTokenData = results[2]?.data as any
        const baseURIData = results[3]?.data as any
        const lsp7Data = results[4]?.data as any
        const metadataIsLoaded = results.slice(4, 7).every(result => {
          console.log(result)
          return result.isFetched || result.failureReason !== undefined
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
          tokenCreators,
          tokenMetadataRaw: {
            lsp7Data,
            baseURIData,
            forTokenData,
          },
          resolvedMetadata: tokenMetadata,
        } as Asset
      },
    })
  }
}
