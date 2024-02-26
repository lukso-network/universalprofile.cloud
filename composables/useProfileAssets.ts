import { useQueries } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

export type AssetData = {
  isNativeToken?: boolean
  isOwned: boolean
  isIssued: boolean
  address: Address
  assetData: any
  tokenStandard: string
  tokenIdFormat: number
  referenceContract: Address
  baseURI?: any
  tokenDataURL?: string
  tokenId?: `0x${string}`
  balance: string
  standard: string
  name: string
  symbol: string
  tokenName: string
  tokenSymbol: string
  tokenType: string
  tokenURI?: string
  supportsInterfaces: Record<string, boolean>
  images: {
    src: string
    verification: any
    width: number
    height: number
    url: string
  }[][]
  icon: {
    src: string
    verification: any
    width: number
    height: number
    url: string
  }[]
}

export function useProfileAssets() {
  return (profileAddress: Address | undefined) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const profile = useProfile()(profileAddress)
    const { value: { chainId } = { chainId: undefined } } = currentNetwork
    // name
    // symbol
    // balanceOf

    const receivedAssetCount = profile?.value?.receivedAssets?.length || 0
    const allAddresses = ([] as `0x${string}`[]).concat(
      profile?.value?.receivedAssets || [],
      profile?.value?.issuedAssets || []
    )
    const queries = allAddresses.flatMap((address: Address) => {
      return [
        {
          // 0
          queryKey: ['data', chainId, address, 'LSP4Metadata'],
        },
        {
          // 1
          queryKey: [
            'call',
            chainId,
            address,
            'tokenIdsOf(address)',
            profileAddress,
          ],
        },
        {
          // 2
          queryKey: [
            'call',
            chainId,
            address,
            'balanceOf(address)',
            profileAddress,
          ],
        },
        {
          // 3
          queryKey: ['call', chainId, address, 'name()'],
        },
        {
          // 4
          queryKey: ['call', chainId, address, 'symbol()'],
        },
        {
          // 5
          queryKey: ['data', chainId, address, 'LSP4TokenName'],
        },
        {
          // 6
          queryKey: ['data', chainId, address, 'LSP4TokenSymbol'],
        },
        {
          // 7
          queryKey: ['data', chainId, address, 'LSP4TokenType'],
        },
        {
          // 8
          queryKey: ['data', chainId, address, 'LSP8TokenMetadataBaseURI'],
        },
        {
          // 9
          queryKey: ['data', chainId, address, 'LSP8TokenStandard'],
        },
        {
          // 10
          queryKey: ['data', chainId, address, 'LSP8TokenIdFormat'],
        },
        // {  // ERC725.js is unable to read LSP8ReferenceConract due to (Address,bytes32) not being supported
        //   // 11
        //   queryKey: ['data', chainId, address, 'LSP8ReferenceContract'],
        // },
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
      ]
    }) as { queryKey: string[] }[]
    return useQueries({
      queries,
      combine: results => {
        if (!profileAddress) {
          return undefined
        }
        const prefixLength = queries.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )
        return (
          allAddresses.flatMap((address, _assetIndex) => {
            const assetIndex =
              _assetIndex * (prefixLength + interfacesToCheck.length)
            const isIssued = _assetIndex > receivedAssetCount
            const assetData = results[assetIndex + 0].data as any
            const tokenIds = results[assetIndex + 1].data as string[]
            const balance = results[assetIndex + 2].data as string
            const name = results[assetIndex + 3].data as string
            const symbol = results[assetIndex + 4].data as string
            const tokenName = results[assetIndex + 5].data as string
            const tokenSymbol = results[assetIndex + 6].data as string
            const tokenType = results[assetIndex + 7].data as string
            const baseURI = results[assetIndex + 8].data as any
            const tokenStandard = results[assetIndex + 9].data as string
            const tokenIdFormat = results[assetIndex + 10].data as number
            const referenceContract = results[assetIndex + 11].data as string
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
                standard: string | null
              }
            )
            const images = assetData?.LSP4Metadata?.images?.map(
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
            const icon = assetData?.LSP4Metadata?.icon?.map((image: any) => {
              const { verification, url } = image
              return {
                ...image,
                src: url.startsWith('ipfs://')
                  ? `https://api.universalprofile.cloud/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
                  : url,
              }
            })
            if (tokenIds && tokenIds.length > 0) {
              return tokenIds.map(tokenId => {
                let tokenURI = undefined
                let tokenDataURL = undefined
                try {
                  switch (tokenIdFormat) {
                    case 0:
                      tokenURI = toNumber(tokenId).toString()
                      break
                    case 1:
                      tokenURI = encodeURI(
                        hexToAscii(tokenId).replace(/\0/g, '')
                      )
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
                    'https://api.universalprofile.cloud/image/'
                  )
                }
                return {
                  isOwned: !isIssued,
                  isIssued,
                  address,
                  assetData,
                  tokenURI,
                  tokenStandard,
                  tokenIdFormat,
                  referenceContract,
                  baseURI,
                  tokenDataURL,
                  tokenId,
                  balance,
                  standard,
                  name,
                  symbol,
                  tokenName,
                  tokenSymbol,
                  tokenType,
                  supportsInterfaces,
                  images,
                  icon,
                } as AssetData
              })
            }
            return {
              isOwned: !isIssued,
              isIssued,
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
              images,
              icon,
            } as AssetData
          }) || []
        )
      },
    })
  }
}
