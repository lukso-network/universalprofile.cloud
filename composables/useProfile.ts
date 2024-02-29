import { useQueries } from '@tanstack/vue-query'

import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'
import type { Standard } from '@/types/contract'

const profileRefs: Record<string, Ref<Profile | null>> = {}

export const getProfile = (
  profileAddress: Address | undefined
): Ref<Profile | null> => {
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
      const { name, profileImage, backgroundImage } =
        profileData?.LSP3Profile || {}
      profileRef.value = {
        address: profileAddress,
        name,
        standard: standard as Standard,
        supportsInterfaces,
        receivedAssets,
        issuedAssets,
        profileImage,
        backgroundImage,
      }
    },
  })
  return profileRef
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
