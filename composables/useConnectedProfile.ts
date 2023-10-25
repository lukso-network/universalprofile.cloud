import { ProfileItem } from '@/models/profile'

export const useConnectedProfile = () => {
  const profileRepo = useRepo(ProfileModel)
  const { connectedProfileAddress } = useAppStore()
  const connectedProfile = ref<ProfileItem>()

  watchEffect(async () => {
    if (!connectedProfileAddress) {
      return
    }

    let storeProfile = profileRepo
      .with('profileImage')
      .find(connectedProfileAddress)

    if (!storeProfile) {
      const fetchedProfile = await fetchProfile(connectedProfileAddress)
      profileRepo.save(fetchedProfile)
      storeProfile = profileRepo
        .with('profileImage')
        .find(connectedProfileAddress)
    }

    connectedProfile.value = storeProfile
  })

  return {
    connectedProfile,
  }
}
