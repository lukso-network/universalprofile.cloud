import { ProfileItem } from '@/models/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileModel)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<ProfileItem>()
  const { isLoadingProfile } = storeToRefs(useAppStore())

  watchEffect(async () => {
    if (!viewedProfileAddress) {
      return
    }

    let storeProfile = profileRepo
      .with('backgroundImage')
      .with('profileImage')
      .find(viewedProfileAddress)

    if (!storeProfile) {
      isLoadingProfile.value = true // TODO check how works loading profile for first time
      const fetchedProfile = await fetchProfile(viewedProfileAddress)
      profileRepo.save(fetchedProfile)
      storeProfile = profileRepo
        .with('backgroundImage')
        .with('profileImage')
        .find(viewedProfileAddress)
      isLoadingProfile.value = false
    }
    viewedProfile.value = storeProfile
  })

  return {
    viewedProfile,
  }
}
