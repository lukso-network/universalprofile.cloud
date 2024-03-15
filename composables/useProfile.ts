import { useQueries } from '@tanstack/vue-query'
import debug from 'debug'

import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'

const profileLog = debug('wallet:profile')

export const getProfile = (
  _profile: Address | undefined | Ref<Address | undefined>
) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  const profileAddress = computed<Address | null>(() =>
    isRef(_profile) ? _profile.value || null : _profile || null
  )
  const queries = computed(() => {
    const { value: { chainId } = { chainId: '' } } = currentNetwork

    if (!profileAddress.value) {
      return []
    }

    return [
      {
        // 0
        queryKey: ['getBalance', profileAddress],
        queryFn: async () => {
          const { getBalance } = useWeb3(PROVIDERS.RPC)
          return profileAddress.value
            ? await getBalance(profileAddress.value)
            : 0
        },
        refetchInterval: 120_000,
        staleTime: 250,
      },
      // 1
      queryGetData({
        chainId,
        address: profileAddress.value,
        keyName: 'LSP3Profile',
      }),
      // 2
      queryGetData({
        chainId,
        address: profileAddress.value,
        keyName: 'LSP5ReceivedAssets[]',
        refetchInterval: 120_000,
        staleTime: 250,
      }),
      // 3
      queryGetData({
        chainId,
        address: profileAddress.value,
        keyName: 'LSP12IssuedAssets[]',
        refetchInterval: 120_000,
        staleTime: 250,
      }),
      // 4-9
      ...interfacesToCheck.map(({ interfaceId }) =>
        queryCallContract({
          chainId,
          address: profileAddress.value as Address,
          method: 'supportsInterface(bytes4)',
          args: [interfaceId],
        })
      ),
    ]
  })
  return useQueries({
    queries,
    combine: results => {
      const profileAddress: Address | null = isRef(_profile)
        ? _profile.value || null
        : _profile || null
      if (!profileAddress) {
        return null
      }
      const balance = results[0].data as string
      const profileData = results[1].data as LSP3ProfileMetadataJSON
      const receivedAssets = results[2].data as Address[]
      const issuedAssets = results[3].data as Address[]
      const { supportsInterfaces, standard } = interfacesToCheck.reduce(
        (
          { supportsInterfaces, standard },
          { interfaceId, standard: _standard },
          index
        ) => {
          const supports = results[index + 4].data as boolean
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
      const { name, profileImage, backgroundImage, links, description, tags } =
        profileData?.LSP3Profile || {}

      const profile = {
        isLoading: results.some(result => result.isLoading),
        address: profileAddress,
        name,
        standard: standard as Standard,
        supportsInterfaces,
        receivedAssets,
        issuedAssets,
        profileImage,
        backgroundImage,
        balance,
        links,
        description,
        tags,
      } as Profile
      if (!profile.isLoading) {
        profileLog('profile', profile)
      }
      return profile
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
  return getProfile(connectedProfileAddress)
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
