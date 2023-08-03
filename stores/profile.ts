export const useProfileStore = defineStore('profile', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({ isLoading: true })

  const setAddress = (newAddress: Address) => {
    profile.address = newAddress
  }

  const setProfile = (newProfile: Profile) => {
    Object.assign(profile, newProfile)
  }

  const setLoading = (newLoading: boolean) => {
    status.isLoading = newLoading
  }

  return {
    setAddress,
    profile,
    setProfile,
    status,
    setLoading,
  }
})
