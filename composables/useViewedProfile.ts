import { Profile } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<Profile>()
  const profileImageUrl = ref<string>()
  const backgroundImageUrl = ref<string>()

  watchEffect(async () => {
    if (!viewedProfileAddress) {
      return
    }

    viewedProfile.value = profileRepo.getProfileAndImages(viewedProfileAddress)
    profileImageUrl.value = await getCachedImageUrl(
      viewedProfile.value?.profileImage
    )
    backgroundImageUrl.value = await getCachedImageUrl(
      viewedProfile.value?.backgroundImage
    )
  })

  return {
    viewedProfile,
    profileImageUrl,
    backgroundImageUrl,
  }
}
