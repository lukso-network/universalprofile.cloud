/**
 * Profile store
 * Keeps the information about viewed profile
 *
 */
export const useProfileStore = defineStore('profile', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({ isLoading: true })
  const assets = reactive<{
    lsp7Assets: Lsp7AssetType[]
    lsp8Assets: Lsp8AssetType[]
  }>({ lsp7Assets: [], lsp8Assets: [] })

  // --- actions

  const setAddress = (newAddress: Address) => {
    profile.address = newAddress
  }

  const setProfile = (newProfile: Profile) => {
    Object.assign(profile, newProfile)
  }

  const setLoading = (newLoading: boolean) => {
    status.isLoading = newLoading
  }

  const clearProfile = () => {
    Object.assign(profile, {})
  }

  const reloadProfile = (address: Address, profile: Profile) => {
    clearProfile()
    setAddress(address)
    setProfile(profile)
  }

  const setLsp7Assets = (newAssets: Lsp7AssetType[]) => {
    assets.lsp7Assets = newAssets
  }

  const setLsp8Assets = (newAssets: Lsp8AssetType[]) => {
    assets.lsp8Assets = newAssets
  }

  return {
    setAddress,
    profile,
    setProfile,
    status,
    setLoading,
    clearProfile,
    reloadProfile,
    assets,
    setLsp7Assets,
    setLsp8Assets,
  }
})
