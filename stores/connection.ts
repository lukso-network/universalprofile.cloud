/**
 * Connection store
 * Keeps the information about connected profile
 *
 */
export const useConnectionStore = defineStore('connection', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({ isConnected: false })

  // --- actions

  const setConnectedAddress = (newAddress: Address) => {
    profile.address = newAddress
  }

  const setConnectedProfile = (newProfile: Profile) => {
    Object.assign(profile, newProfile)
  }

  const clearConnectedProfile = () => {
    Object.assign(profile, {})
  }

  const setIsConnected = (value: boolean) => {
    status.isConnected = value
  }

  const reloadConnectedProfile = (address: Address, profile: Profile) => {
    clearConnectedProfile()
    setConnectedAddress(address)
    setConnectedProfile(profile)
  }

  return {
    setConnectedAddress,
    profile,
    setConnectedProfile,
    status,
    clearConnectedProfile,
    setIsConnected,
    reloadConnectedProfile,
  }
})
