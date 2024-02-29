import { useQueries } from '@tanstack/vue-query'
import ABICoder from 'web3-eth-abi'

import type { AssetData } from './useProfileAssets'
import type { Image } from '@/types/image'

export type TokenData = AssetData & {
  forTokenData: any
  forTokenImages: Image[][]
  forTokenIcon: Image[]
  baseURIImages: Image[][]
  baseURIIcon: Image[]
  lsp7Images: Image[][]
  lsp7Icon: Image[]
  owner: string
  creator: string
  tokenCreators: string[]
}

const tokenRefs: Record<string, Ref<TokenData | null>> = {}

export function useToken() {
  return (token: AssetData | undefined): Ref<TokenData | null> => {
    const tokenId = token?.tokenId
    const key = `${token?.address}-${tokenId}`
    let outputToken = tokenRefs[key]
    if (!outputToken) {
      outputToken = tokenRefs[key] = ref<TokenData | null>(null)
    }
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
                  queryFn: () => {
                    if (token.tokenDataURL) {
                      const url = token.tokenDataURL.replace(
                        /^ipfs:\/\//,
                        'https://api.universalprofile.cloud/ipfs/'
                      )
                      return fetch(url).then(response => {
                        if (!response.ok) {
                          throw new Error('Unable to fetch')
                        }
                        return response.json()
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
    useQueries({
      queries,
      combine: results => {
        if (!token) {
          return undefined
        }
        const owner = results[0].data as string
        const creator = results[1].data as string
        const tokenCreators = results[2].data as string[]
        const decimals = results[3]?.data as number
        const forTokenData = results[4]?.data as any
        const forTokenImages = forTokenData?.LSP4Metadata?.images?.map(
          (images: any) => {
            return images.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              }
            })
          }
        )
        const forTokenIcon = forTokenData?.LSP4Metadata?.icon?.map(
          (image: any) => {
            const { verification, url } = image
            return {
              ...image,
              src: url.startsWith('ipfs://')
                ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                : url,
            }
          }
        )
        const tokenJSON = results[5]?.data as any
        const baseURIImages = tokenJSON?.LSP4Metadata?.images?.map(
          (images: any) => {
            return images.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              }
            })
          }
        )
        const baseURIIcon = tokenJSON?.LSP4Metadata?.icon?.map((image: any) => {
          const { verification, url } = image
          return {
            ...image,
            src: url.startsWith('ipfs://')
              ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
              : url,
          }
        })
        const lsp7JSON = results[6]?.data as any
        const lsp7Images = lsp7JSON?.LSP4Metadata?.images?.map(
          (images: any) => {
            return images.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              }
            })
          }
        )
        const lsp7Icon = lsp7JSON?.LSP4Metadata?.icon?.map((image: any) => {
          const { verification, url } = image
          return {
            ...image,
            src: url.startsWith('ipfs://')
              ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
              : url,
          }
        })
        outputToken.value = {
          ...token,
          forTokenData,
          forTokenImages,
          forTokenIcon,
          lsp7Images,
          lsp7Icon,
          baseURIImages,
          baseURIIcon,
          owner,
          creator,
          tokenCreators,
          decimals,
        } as TokenData
      },
    })
    return outputToken
  }
}
