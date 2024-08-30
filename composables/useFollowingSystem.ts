import { useQueries } from '@tanstack/vue-query'

import LSP26FollowingSystemContract from '@/shared/abis/LSP26FollowingSystem.json'

import type { LSP26FollowingSystem } from '@/contracts/LSP26FollowingSystem'
import type { AbiItem } from 'web3-utils'

export const useFollowingSystem = () => {
  const { currentNetwork } = storeToRefs(useAppStore())
  const { followingSystemContractAddress } = currentNetwork.value

  const { contract: contractInjected } = useWeb3(PROVIDERS.INJECTED)
  let followingSystemContractInjected: LSP26FollowingSystem | undefined

  try {
    followingSystemContractInjected = contractInjected<LSP26FollowingSystem>(
      LSP26FollowingSystemContract.abi as AbiItem[],
      followingSystemContractAddress
    )
  } catch (error) {
    console.warn(error)
  }

  const { contract: contractRpc, getWeb3 } = useWeb3(PROVIDERS.RPC)
  const followingSystemContractRpc = contractRpc<LSP26FollowingSystem>(
    LSP26FollowingSystemContract.abi as AbiItem[],
    followingSystemContractAddress
  )

  return {
    follow: (address?: Address) => {
      try {
        assertAddress(address)

        return followingSystemContractInjected?.methods.follow(address)
      } catch (error) {
        console.warn(error)
      }
    },
    unfollow: (address?: Address) => {
      try {
        assertAddress(address)

        return followingSystemContractInjected?.methods.unfollow(address)
      } catch (error) {
        console.warn(error)
      }
    },
    followerCount: async (address?: Address) => {
      if (!getWeb3().currentProvider) {
        throw new Error('No provider')
      }
      try {
        assertAddress(address)

        return await followingSystemContractRpc?.methods
          .followerCount(address)
          .call()
      } catch (error) {
        console.warn(error)
      }
    },
    followingCount: async (address?: Address) => {
      if (!getWeb3().currentProvider) {
        throw new Error('No provider')
      }
      try {
        assertAddress(address)

        return await followingSystemContractRpc?.methods
          .followingCount(address)
          .call()
      } catch (error) {
        console.warn(error)
      }
    },
    followerAddresses: async (address?: Address) => {
      if (!getWeb3().currentProvider) {
        throw new Error('No provider')
      }

      try {
        assertAddress(address)

        const followerCount =
          (await followingSystemContractRpc?.methods
            .followerCount(address)
            .call()) || 0
        return await followingSystemContractRpc?.methods
          .getFollowersByIndex(address, 0, followerCount)
          .call()
      } catch (error) {
        console.warn(error)
      }
    },
    followingAddresses: async (address?: Address) => {
      if (!getWeb3().currentProvider) {
        throw new Error('No provider')
      }
      try {
        assertAddress(address)

        const followingCount =
          (await followingSystemContractRpc?.methods
            .followingCount(address)
            .call()) || 0
        return await followingSystemContractRpc?.methods
          .getFollowsByIndex(address, 0, followingCount)
          .call()
      } catch (error) {
        console.warn(error)
      }
    },
    getFollowersData: (_profileAddress: MaybeRef<Address | undefined>) => {
      const { followerCount } = useFollowingSystem()
      const queries = computed(() => {
        const profileAddress = unref(_profileAddress)
        const { connectedProfileAddress } = storeToRefs(useAppStore())
        const connectedAddress = unref(connectedProfileAddress)
        const { selectedChainId: chainId } = useAppStore()

        const queries = profileAddress
          ? [
              {
                // 0
                queryKey: ['followingCount', profileAddress, chainId],
                queryFn: async () => {
                  const { followingCount } = useFollowingSystem()
                  return (await followingCount(profileAddress)) || 0
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
              {
                // 1
                queryKey: ['followingAddresses', profileAddress, chainId],
                queryFn: async () => {
                  const { followingAddresses } = useFollowingSystem()
                  return (await followingAddresses(profileAddress)) || []
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
              {
                // 2
                queryKey: ['followerCount', profileAddress, chainId],
                queryFn: async () => {
                  return (await followerCount(profileAddress)) || 0
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
              {
                // 3
                queryKey: ['followerAddresses', profileAddress, chainId],
                queryFn: async () => {
                  const { followerAddresses } = useFollowingSystem()
                  return (await followerAddresses(profileAddress)) || []
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
              connectedAddress
                ? {
                    // 4
                    queryKey: [
                      'isFollowing',
                      profileAddress,
                      connectedAddress,
                      chainId,
                    ],
                    queryFn: async () => {
                      assertAddress(connectedAddress)
                      const { contract } = useWeb3(PROVIDERS.INJECTED)
                      const { followingSystemContractAddress } =
                        currentNetwork.value
                      const followingSystemContract =
                        contract<LSP26FollowingSystem>(
                          LSP26FollowingSystemContract.abi as AbiItem[],
                          followingSystemContractAddress
                        )
                      const isFollowing =
                        (await followingSystemContract?.methods
                          .isFollowing(connectedAddress, profileAddress)
                          .call()) || false
                      return isFollowing
                    },
                    refetchInterval: 120_000,
                    staleTime: 250,
                  }
                : queryNull(),
            ]
          : []
        return queries
      })
      return useQueries({
        queries,
        combine: results => {
          const followingCount = results[0]?.data as number
          const followingAddresses = results[1]?.data as Address[]
          const followerCount = results[2]?.data as number
          const followerAddresses = results[3]?.data as Address[]
          const isFollowing = results[4]?.data as boolean
          const isLoading = results.some(result => result.isLoading)
          const isLoadingCounters = [0, 2].some(
            index => results[index]?.isLoading
          )

          const profileFollowers = {
            isFollowing,
            followingCount,
            followingAddresses,
            followerCount,
            followerAddresses,
            isLoading,
            isLoadingCounters,
          } as ProfileFollowers

          if (!profileFollowers.isLoading && followersLog.enabled) {
            followersLog('profileFollowers', profileFollowers)
          }
          return profileFollowers
        },
      })
    },
  }
}
