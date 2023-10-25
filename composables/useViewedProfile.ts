import { ProfileItem } from '@/models/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileModel)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<ProfileItem>()

  watchEffect(() => {
    viewedProfile.value = profileRepo
      .with('backgroundImage')
      .with('profileImage')
      .find(viewedProfileAddress)
  })

  return {
    viewedProfile,
  }
}
