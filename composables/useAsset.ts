import { useQueries } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import type { Asset, ExtendedAssetMetadata } from '@/types/asset'

export function useAsset() {
  return (address: string, tokenId?: string) => {
    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = connectedProfile.value?.address
    const { currentNetwork } = storeToRefs(useAppStore())
    const queries: ComputedRef<Array<{ queryKey: string[] }>> = computed(() => {
      const chainId = currentNetwork.value?.chainId || ''
      const queries: Array<{ queryKey: string[] }> = [
        {
          // 0
          queryKey: ['data', chainId, address, 'LSP4Metadata'],
        },
        {
          // 1
          queryKey: ['call', chainId, address, 'name()'],
        },
        {
          // 2
          queryKey: ['call', chainId, address, 'symbol()'],
        },
        {
          // 3
          queryKey: ['data', chainId, address, 'LSP4TokenName'],
        },
        {
          // 4
          queryKey: ['data', chainId, address, 'LSP4TokenSymbol'],
        },
        {
          // 5
          queryKey: ['data', chainId, address, 'LSP4TokenType'],
        },
        {
          // 6
          queryKey: ['data', chainId, address, 'LSP8TokenMetadataBaseURI'],
        },
        {
          // 7
          queryKey: ['data', chainId, address, 'LSP8TokenStandard'],
        },
        {
          // 8
          queryKey: ['data', chainId, address, 'LSP8TokenIdFormat'],
        },
        {
          // 9
          queryKey: ['call', chainId, address, 'decimals()'],
        },
        ...(profileAddress
          ? [
              {
                // 11
                queryKey: [
                  'call',
                  chainId,
                  address,
                  'balanceOf(address)',
                  profileAddress,
                ],
              },
            ]
          : []),
        ...interfacesToCheck.map(({ interfaceId }) => {
          return {
            queryKey: [
              'call',
              chainId,
              address,
              'supportsInterface(bytes4)',
              interfaceId,
            ],
          }
        }),
      ] as Array<{ queryKey: string[] }>
      return queries
      // Trick to keep the right receivedAssetCount and allAddresses attached
      // to the current queries list.
    })
    return useQueries({
      queries: queries,
      combine: results => {
        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )
        const assetData = results[0].data as any
        const name = results[1].data as string
        const symbol = results[2].data as string
        const tokenName = results[3].data as string
        const tokenSymbol = results[4].data as string
        const tokenType = results[5].data as number
        const baseURI = results[6].data as any
        const tokenStandard = results[7].data as string
        const tokenIdFormat = results[8].data as number
        const referenceContract = results[9].data as string
        const decimals = results[10].data as number
        const balance = results[11].data as string
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
        let metadata: ExtendedAssetMetadata | undefined
        if (assetData) {
          const attributes = assetData?.LSP4Metadata?.attributes
          const links = assetData?.LSP4Metadata?.links
          const description = assetData?.LSP4Metadata?.description
          const assets =
            assetData?.LSP7Metadata?.assets.map((asset: AssetMetadata) => {
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
            assetData?.LSP4Metadata?.images?.map((images: any) => {
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
            assetData?.LSP4Metadata?.icon?.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              } as Image & { src: string }
            }) || []
          metadata = { assets, attributes, description, images, icon, links }
        }
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
              'https://api.universalprofile.cloud/ipfs/'
            )
          }
          return {
            address,
            assetData,
            tokenURI,
            tokenStandard,
            tokenIdFormat,
            referenceContract,
            baseURI,
            tokenDataURL,
            decimals,
            tokenId,
            balance,
            standard,
            name,
            symbol,
            tokenName,
            tokenSymbol,
            tokenType,
            supportsInterfaces,
            metadata,
            get resolvedMetadata() {
              return metadata
            },
          } as Asset
        }
        return {
          address,
          assetData,
          tokenStandard,
          tokenIdFormat,
          referenceContract,
          baseURI,
          balance,
          standard,
          name,
          symbol,
          tokenName,
          tokenSymbol,
          tokenType,
          supportsInterfaces,
          metadata,
          get resolvedMetadata() {
            return metadata
          },
        } as Asset
      },
    })
  }
}
