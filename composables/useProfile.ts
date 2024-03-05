import { useQueries } from '@tanstack/vue-query'

import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'
import type { Profile } from '@/models/profile'
import type { Standard } from '@/types/contract'

export const getProfile = (profileAddress: Address | undefined) => {
  const { currentNetwork } = storeToRefs(useAppStore())
  const queries = computed(() => {
    const { value: { chainId } = { chainId: '' } } = currentNetwork
    return profileAddress
      ? [
          queryGetData({
            chainId,
            address: profileAddress,
            keyName: 'LSP3Profile',
          }),
          ...interfacesToCheck.map(({ interfaceId }) =>
            queryCallContract({
              chainId,
              address: profileAddress,
              method: 'supportsInterface(bytes4)',
              args: [interfaceId],
            })
          ),
          queryGetData({
            chainId,
            address: profileAddress,
            keyName: 'LSP5ReceivedAssets[]',
          }),
          queryGetData({
            chainId,
            address: profileAddress,
            keyName: 'LSP12IssuedAssets[]',
          }),
        ]
      : []
  })
  return useQueries({
    queries,
    combine: results => {
      if (!profileAddress) {
        return null
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
      const { name, profileImage, backgroundImage } =
        profileData?.LSP3Profile || {}
      return {
        isLoading: results.some(result => result.isLoading),
        address: profileAddress,
        name,
        standard: standard as Standard,
        supportsInterfaces,
        receivedAssets,
        issuedAssets,
        profileImage,
        backgroundImage,
      } as Profile
    },
  })
}

/**
 * Get profile that is connected to dApp
 *
 * @returns
 */
const connectedProfile = () => {
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  return getProfile(connectedProfileAddress.value)
}

/**
 * Get profile that is currently viewed in dApp
 *
 * @returns
 */
const viewedProfile = () => {
  const viewedProfileAddress = getCurrentProfileAddress()
  return getProfile(viewedProfileAddress)
}

export function useProfile() {
  return {
    getProfile,
    connectedProfile,
    viewedProfile,
  }
}
