import { useQueries } from '@tanstack/vue-query'

import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'

export type Profile = {
  address: Address
  name?: string
  standard: string | null
  balance?: string
  supportsInterfaces: Record<string, boolean>
  receivedAssets: Address[]
  issuedAssets: Address[]
  profileImages: {
    src: string
    verification: any
    width: number
    height: number
    url: string
  }[]
  backgroundImages: {
    src: string
    verification: any
    width: number
    height: number
    url: string
  }[]
}

const profileRefs: Record<string, Ref<Profile | null>> = {}

export function useProfile() {
  return (profileAddress: Address | undefined): Ref<Profile | null> => {
    let profileRef = profileRefs[profileAddress || '']
    if (!profileRef) {
      profileRef = ref<Profile | null>(null)
      profileRefs[profileAddress || ''] = profileRef
    }
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
    useQueries({
      queries,
      combine: results => {
        if (!profileAddress) {
          return undefined
        }
        const profileData = results[0].data as LSP3ProfileMetadataJSON
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
        const profileImages = profileData?.LSP3Profile?.profileImage?.map(
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
        const backgroundImages = profileData?.LSP3Profile?.backgroundImage?.map(
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
        const { name } = profileData?.LSP3Profile || {}

        profileRef.value = {
          address: profileAddress,
          name,
          standard,
          supportsInterfaces,
          receivedAssets,
          issuedAssets,
          profileImages: profileImages || [],
          backgroundImages: backgroundImages || [],
        }
      },
    })
    return profileRef
  }
}
