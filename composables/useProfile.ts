import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import { keccak256, toChecksumAddress } from 'web3-utils'

import { browserProcessMetadata } from '@/utils/processMetadata'

import type { ProfileLink } from '@/types/profile'
import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { ProfileQuery } from '@/.nuxt/gql/default'

type AdditionalQueryOptions = { profileAddress?: Address }

export const getProfile = (_profileAddress: MaybeRef<Address | undefined>) => {
  const { currentNetwork } = storeToRefs(useAppStore())
  const chainId = currentNetwork.value?.chainId || ''
  const isPending = ref(false)
  const queryClient = useQueryClient()

  const queries = computed(() => {
    const profileAddress = unref(_profileAddress)?.toLowerCase() as Address

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
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            },
            // 1
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP3Profile',
              process: data => browserProcessMetadata(data, keccak256),
              enabled: !isPending,
            }),
            // 2
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP5ReceivedAssets[]',
              refetchInterval: 120_000,
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            }),
            // 3
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP12IssuedAssets[]',
              refetchInterval: 120_000,
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            }),
            {
              // 4
              queryKey: ['profileResolve', chainId, profileAddress],
              queryFn: async () => {
                return await resolveProfile(profileAddress)
              },
              refetchInterval: 120_000,
              staleTime: isPending.value ? TANSTACK_DEFAULT_STALE_TIME : 250,
              enabled: !isPending,
            },
            // 5-10
            ...interfacesToCheck.map(({ interfaceId }) =>
              queryCallContract({
                chainId,
                address: profileAddress as Address,
                method: 'supportsInterface(bytes4)',
                args: [interfaceId],
                enabled: !isPending,
              })
            ),
          ]
        : []
    ) as QFQueryOptions[] & AdditionalQueryOptions
    queries.profileAddress = profileAddress
    return queries
  })

  const profileAddress = unref(_profileAddress)?.toLowerCase() as Address
  const { isPending: _isPending } = useQuery({
    queryKey: ['graph-profile', profileAddress],
    queryFn: async () => {
      if (!profileAddress) {
        return {}
      }

      const { Profile_by_pk: profile }: ProfileQuery = await GqlProfile({
        id: profileAddress,
      })

      if (graphLog.enabled) {
        graphLog('profile', profile)
      }

      // 1 LSP3Profile
      const profileDataKey = queries.value[1].queryKey
      const profileData: LSP3ProfileMetadataJSON = {
        LSP3Profile: validateLsp3Metadata({
          name: profile?.name || '',
          backgroundImage: profile?.backgroundImages || [],
          profileImage: profile?.profileImages,
          description: profile?.description,
          // @ts-ignore // TODO remove this when Graph is updated with missing field
          tags: profile?.tags,
          avatar: profile?.avatars, // TODO properly re-map avatars from Graph when they are supported
          links: profile?.links,
        }),
      }
      queryClient.setQueryData(profileDataKey, profileData)

      // 2 LSP5ReceivedAssets
      const receivedAssetsKey = queries.value[2].queryKey
      // TODO this is workaround for getting received assets from holds before we get proper data from lsp5ReceivedAssets
      const receivedAssets: string[] = Array.from(
        new Set(
          (
            profile?.holds?.map(
              ({ asset, token }) => asset?.id || token?.baseAsset?.id || ''
            ) || []
          ).filter(address => !!address)
        )
      )
      // const receivedAssets: Address[] | undefined =
      //   profile?.lsp5ReceivedAssets?.map(asset => asset.id as Address)
      queryClient.setQueryData(receivedAssetsKey, receivedAssets)

      // 3 LSP12IssuedAssets
      const issuedAssetsKey = queries.value[3].queryKey
      const issuedAssets: Address[] | undefined =
        profile?.lsp12IssuedAssets?.map(asset => asset.id as Address)
      queryClient.setQueryData(issuedAssetsKey, issuedAssets)

      // 4 ProfileLink
      const profileLinkKey = queries.value[4].queryKey
      const checksummed = toChecksumAddress(profileAddress) as Address
      const profileLink: ProfileLink | undefined = {
        address: profileAddress,
        resolved: profileAddress,
        link: profile?.fullName || `${BASE_PROFILE_LINK_URL}/${checksummed}`,
        checksummed,
        isResolved: !!profile?.fullName,
      }
      queryClient.setQueryData(profileLinkKey, profileLink)

      // 5+ supportsInterface(bytes4)
      interfacesToCheck.map(({ standard, interfaceId }, index) => {
        const supportsInterfaceKey = queries.value[index + 5].queryKey
        const supportsInterface =
          profile?.standard === standard &&
          profile?.interfaces.includes(interfaceId)
        queryClient.setQueryData(supportsInterfaceKey, supportsInterface)
      })

      return {}
    },
    staleTime: TANSTACK_GRAPH_STALE_TIME,
    enabled: computed(() => !!profileAddress && queries.value.length > 0),
  })

  isPending.value = _isPending.value

  return useQueries({
    queries,
    combine: results => {
      const profileAddress: Address | undefined = queries.value.profileAddress
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
          standard: Standard | null
        }
      )
      const { name, profileImage, backgroundImage, links, description, tags } =
        profileData?.LSP3Profile || {}

      const profile = {
        isLoading,
        address: profileAddress,
        name,
        standard,
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
