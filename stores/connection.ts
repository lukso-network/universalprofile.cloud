/**
 * Connection store
 * Keeps the information about connected profile
 *
 */
export const useConnectionStore = defineStore('connection', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({ isLoading: true, isConnected: false })
  const assets = reactive<{
    lsp7Assets: Lsp7AssetType[]
    lsp8Assets: Lsp8AssetType[]
  }>({ lsp7Assets: [], lsp8Assets: [] })

  // --- actions

  const setConnectedAddress = (newAddress: Address) => {
    profile.address = newAddress
  }

  const setConnectedProfile = (newProfile: Profile) => {
    Object.assign(profile, newProfile)
  }

  const setLoading = (newLoading: boolean) => {
    status.isLoading = newLoading
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

  const setLsp7Assets = (newAssets: Lsp7AssetType[]) => {
    assets.lsp7Assets = newAssets
  }

  const setLsp8Assets = (newAssets: Lsp8AssetType[]) => {
    assets.lsp8Assets = newAssets
  }

  return {
    setConnectedAddress,
    profile,
    setConnectedProfile,
    status,
    setLoading,
    clearConnectedProfile,
    setIsConnected,
    reloadConnectedProfile,
    assets,
    setLsp7Assets,
    setLsp8Assets,
  }
})
