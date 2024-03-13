import { useQueries } from '@tanstack/vue-query'

import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'

export const getProfile = (
  _profile: Address | undefined | ComputedRef<Address | undefined>
) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  const queries = computed(() => {
    const profileAddress: Address | null = isRef(_profile)
      ? _profile.value || null
      : _profile || null
    const { value: { chainId } = { chainId: '' } } = currentNetwork

    if (!profileAddress) {
      return []
    }

    return [
      {
        // 0
        queryKey: ['getBalance', profileAddress],
        queryFn: async () => {
          const { getBalance } = useWeb3(PROVIDERS.RPC)
          const balance = await getBalance(profileAddress)
          return balance
        },
        refetchInterval: 120_000,
        staleTime: 10_000,
      },
      // 1
      queryGetData({
        chainId,
        address: profileAddress,
        keyName: 'LSP3Profile',
      }),
      // 2
      queryGetData({
        chainId,
        address: profileAddress,
        keyName: 'LSP5ReceivedAssets[]',
        refetchInterval: 120_000,
        staleTime: 10_000,
      }),
      // 3
      queryGetData({
        chainId,
        address: profileAddress,
        keyName: 'LSP12IssuedAssets[]',
        refetchInterval: 120_000,
        staleTime: 10_000,
      }),
      // 4-9
      ...interfacesToCheck.map(({ interfaceId }) =>
        queryCallContract({
          chainId,
          address: profileAddress,
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
        balance,
        links,
        description,
        tags,
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
