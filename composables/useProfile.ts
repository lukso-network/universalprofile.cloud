export const getProfile = (profileAddress: MaybeRef<Address | undefined>) => {
  const { isRpc } = storeToRefs(useAppStore())

  if (isRpc.value) {
    return useProfileRpc().getProfile(profileAddress)
  }

  return useProfileGraph().getProfile(profileAddress)
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

const viewedProfileIsConnected = (viewedProfileAddress?: Address) => {
  const { connectedProfileAddress, isConnected } = storeToRefs(useAppStore())

  return (
    isConnected.value &&
    // we need to compare lowercase addresses in case of checksummed addresses
    connectedProfileAddress.value?.toLowerCase() ===
      viewedProfileAddress?.toLowerCase()
  )
}

export function useProfile() {
  return {
    getProfile,
    connectedProfile,
    viewedProfile,
    viewedProfileIsConnected,
  }
}
