import { Profile } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<Profile>()

  watchEffect(async () => {
    if (!viewedProfileAddress) {
      return
    }

    const storeProfile = profileRepo.getProfileAndImages(viewedProfileAddress)
    viewedProfile.value = storeProfile
  })

  return {
    viewedProfile,
  }
}
