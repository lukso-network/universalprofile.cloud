import LSP26FollowingSystemContract from '@/shared/abis/LSP26FollowingSystem.json'

import type { LSP26FollowingSystem } from '@/contracts/LSP26FollowingSystem'
import type { AbiItem } from 'web3-utils'

export const useFollowingSystem = () => {
  const connectedProfile = useProfile().connectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())
  const { followingSystemContractAddress } = currentNetwork.value
  const { contract } = useWeb3(PROVIDERS.INJECTED)
  const followingSystemContract = contract<LSP26FollowingSystem>(
    LSP26FollowingSystemContract.abi as AbiItem[],
    followingSystemContractAddress
  )

  return {
    follow: async (address?: Address) => {
      try {
        assertAddress(address)

        await followingSystemContract.methods
          .follow(address)
          .send({ from: connectedProfile.value?.address })
      } catch (error) {
        console.warn(error)
      }
    },
    unfollow: async (address?: Address) => {
      try {
        assertAddress(address)

        await followingSystemContract.methods
          .unfollow(address)
          .send({ from: connectedProfile.value?.address })
      } catch (error) {
        console.warn(error)
      }
    },
  }
}
