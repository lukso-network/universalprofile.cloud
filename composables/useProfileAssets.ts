import { useQueries } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import type { Asset, LSP4DigitalAssetMetadata } from '@/types/asset'
import type { QFQueryOptions } from '@/utils/queryFunctions'

export function useProfileAssets() {
  return (profileAddress?: Address | null) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const profile = useProfile().viewedProfile()
    const queries: ComputedRef<
      Array<QFQueryOptions> & {
        receivedAssetCount: number
        allAddresses: Address[]
      }
    > = computed(() => {
      const { value: { chainId } = { chainId: '' } } = currentNetwork
      const receivedAssetCount = profile?.value?.receivedAssets?.length || 0
      const allAddresses = ([] as `0x${string}`[]).concat(
        profile?.value?.receivedAssets || [],
        profile?.value?.issuedAssets || []
      )
      const queries: Array<QFQueryOptions> & {
        receivedAssetCount: number
        allAddresses: Address[]
      } = allAddresses.flatMap((address: Address) => {
        return [
          queryGetData({
            // 0
            chainId,
            address,
            keyName: 'LSP4Metadata',
            isBig: true,
          }),
          queryCallContract({
            // 1
            chainId,
            address,
            method: 'tokenIdsOf(address)',
            args: [profileAddress],
            refetchInterval: 120000,
            staleTime: 60000,
          }),
          queryCallContract({
            // 2
            chainId,
            address,
            method: 'balanceOf(address)',
            args: [profileAddress],
            refetchInterval: 120000,
            staleTime: 0,
          }),
          queryGetData({
            // 3
            chainId,
            address,
            keyName: 'LSP4TokenName',
          }),
          queryGetData({
            // 4
            chainId,
            address,
            keyName: 'LSP4TokenSymbol',
          }),
          queryGetData({
            // 5
            chainId,
            address,
            keyName: 'LSP4TokenType',
          }),
          queryGetData({
            // 6
            chainId,
            address,
            keyName: 'LSP8TokenMetadataBaseURI',
          }),
          queryGetData({
            // 7
            chainId,
            address,
            keyName: 'LSP8TokenIdFormat',
          }),
          queryCallContract({
            // 8
            chainId,
            address,
            method: 'decimals()',
          }),
          ...interfacesToCheck.map(({ interfaceId }) => {
            return queryCallContract({
              // 9+
              chainId,
              address,
              method: 'supportsInterface(bytes4)',
              args: [interfaceId],
            })
          }),
        ]
      }) as Array<QFQueryOptions> & {
        receivedAssetCount: number
        allAddresses: Address[]
      }
      // Trick to keep the right receivedAssetCount and allAddresses attached
      // to the current queries list.
      queries.receivedAssetCount = receivedAssetCount
      queries.allAddresses = allAddresses
      return queries as Array<QFQueryOptions> & {
        receivedAssetCount: number
        allAddresses: Address[]
      }
    })
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
          const isIssued = _assetIndex > queries.value.receivedAssetCount
          const assetData = results[assetIndex + 0].data as any
          const tokenIds = results[assetIndex + 1].data as string[]
          const balance = results[assetIndex + 2].data as string
          const tokenName = results[assetIndex + 3].data as string
          const tokenSymbol = results[assetIndex + 4].data as string
          const tokenType = results[assetIndex + 5].data as number
          const baseURI = results[assetIndex + 6].data as any
          const tokenIdFormat = results[assetIndex + 7].data as number
          const decimals = (results[assetIndex + 8].data as number) || 0
          const referenceContract = results[assetIndex + 9].data as string
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
          let metadata: LSP4DigitalAssetMetadata | undefined
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
                isLoading: false,
                isOwned: !isIssued,
                isIssued,
                address,
                assetData,
                tokenURI,
                tokenIdFormat,
                referenceContract,
                baseURI,
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
                metadata,
                resolvedMetadata: metadata,
              } as Asset
            })
          }
          return {
            isLoading: false,
            isOwned: !isIssued,
            isIssued,
            address,
            assetData,
            tokenIdFormat,
            referenceContract,
            baseURI,
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
            metadata,
            decimals,
            get resolvedMetadata() {
              return metadata
            },
          } as Asset
        }) || []) as Asset[]
      },
    })
  }
}
