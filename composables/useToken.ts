import { useQueries } from '@tanstack/vue-query'

import type { AssetData } from './useProfileAssets'

export function useToken() {
  return (token: AssetData | undefined, tokenId?: `0x${string}`) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: undefined } } = currentNetwork
    const queries = token?.address
      ? [
          {
            queryKey: [
              'tokenData',
              chainId,
              token?.address,
              tokenId,
              'LSP4Metadata',
            ],
          },
          {
            queryKey: ['call', chainId, token?.address, 'owner()'],
          },
          {
            queryKey: ['call', chainId, token?.address, 'creator()'],
          },
          {
            queryKey: ['data', chainId, token?.address, 'LSP4Creators[]'],
          },
          ...(tokenId ? [] : []),
        ]
      : []
    return useQueries({
      queries,
      combine: results => {
        if (!token) {
          return undefined
        }
        const tokenData = results[0].data as any
        const tokenAssets = tokenData?.LSP4Metadata?.assets?.map(
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
        const tokenIcon = tokenData?.LSP4Metadata?.icon?.map((image: any) => {
          const { verification, url } = image
          return {
            ...image,
            src: url.startsWith('ipfs://')
              ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
              : url,
          }
        })
        return {
          ...token,
          tokenData,
          tokenAssets,
          tokenIcon,
        }
      },
    })
  }
}
