import { useQueries } from '@tanstack/vue-query'

export function useProfile() {
  return (profileAddress: Address | undefined) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: undefined } } = currentNetwork
    const queries = profileAddress
      ? [
          {
            queryKey: ['data', chainId, profileAddress, 'LSP3Profile'],
          },
          ...interfacesToCheck.map(({ interfaceId }) => ({
            queryKey: [
              'call',
              chainId,
              profileAddress,
              'supportsInterface(bytes4)',
              interfaceId,
            ],
          })),
          {
            queryKey: ['data', chainId, profileAddress, 'LSP5ReceivedAssets[]'],
          },
          {
            queryKey: ['data', chainId, profileAddress, 'LSP12IssuedAssets[]'],
          },
        ]
      : []
    return useQueries({
      queries,
      combine: results => {
        if (!profileAddress) {
          return undefined
        }
        const profileData = results[0].data as any
        const { supportsInterfaces, standard } = interfacesToCheck.reduce(
          (
            { supportsInterfaces, standard },
            { interfaceId, standard: _standard },
            index
          ) => {
            const supports = results[index + 1].data as boolean
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
        const receivedAssets = results[results.length - 2].data as Address[]
        const issuedAssets = results[results.length - 1].data as Address[]
        const profileImage = profileData?.LSP3Profile?.profileImage?.map(
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
        const backgroundImage = profileData?.LSP3Profile?.backgroundImage?.map(
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
        return {
          profileAddress,
          profileData,
          standard,
          supportsInterfaces,
          receivedAssets,
          issuedAssets,
          profileImage,
          backgroundImage,
        }
      },
    })
  }
}
