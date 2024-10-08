import { useQueries } from '@tanstack/vue-query'
import { keccak256 } from 'web3-utils'

import { browserProcessMetadata } from '@/utils/processMetadata'

import type { ProfileLink } from '@/types/profile'
import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { LSP3ProfileMetadataJSON } from '@lukso/lsp-smart-contracts'

type AdditionalQueryOptions = { profileAddress?: Address | null }

export const getProfile = (_profile: MaybeRef<Address | undefined>) => {
  const { selectedChainId: chainId } = useAppStore()

  const queries = computed(() => {
    const profileAddress = unref(_profile)

    const queries: QFQueryOptions[] & AdditionalQueryOptions = (
      profileAddress
        ? [
            {
              // 0
              queryKey: ['getBalance', profileAddress],
              queryFn: async () => {
                const { getBalance } = useWeb3(PROVIDERS.RPC)
                return profileAddress ? await getBalance(profileAddress) : 0
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
            // 1
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP3Profile',
              process: data => browserProcessMetadata(data, keccak256),
            }),
            // 2
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP5ReceivedAssets[]',
              refetchInterval: 120_000,
              staleTime: 250,
            }),
            // 3
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP12IssuedAssets[]',
              refetchInterval: 120_000,
              staleTime: 250,
            }),
            {
              // 4
              queryKey: ['profileResolve', chainId, profileAddress],
              queryFn: async () => {
                return await resolveProfile(profileAddress)
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
            // 5+
            ...interfacesToCheck.map(({ interfaceId }) =>
              queryCallContract({
                chainId,
                address: profileAddress as Address,
                method: 'supportsInterface(bytes4)',
                args: [interfaceId],
              })
            ),
          ]
        : []
    ) as QFQueryOptions[] & AdditionalQueryOptions
    queries.profileAddress = profileAddress
    return queries
  })
  return useQueries({
    queries,
    combine: results => {
      const profileAddress: Address | null | undefined =
        queries.value.profileAddress
      if (!profileAddress) {
        return null
      }
      const isLoading = results.some(result => result.isLoading)
      const balance = results[0].data as string
      const profileData = results[1].data as LSP3ProfileMetadataJSON
      const receivedAssets = results[2].data as Address[]
      const issuedAssets = results[3].data as Address[]
      const profileLink = (results[4].data as ProfileLink) || {}
      const { supportsInterfaces, standard } = interfacesToCheck.reduce(
        (
          { supportsInterfaces, standard },
          { interfaceId, standard: _standard },
          index
        ) => {
          const supports = results[index + 5].data as boolean
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
        isLoading,
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
        profileLink,
      } as Profile
      if (!profile.isLoading && profileLog.enabled) {
        profileLog('profile', profile)
      }
      return profile
    },
  })
}

export function useProfileRpc() {
  return {
    getProfile,
  }
}
