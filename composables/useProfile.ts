import { Profile } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useProfile = (profileAddress?: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = ref<Profile>()
  const profileImageUrl = ref<string>()
  const backgroundImageUrl = ref<string>()

  watchEffect(async () => {
    if (!profileAddress) {
      return
    }

    profile.value = profileRepo.getProfileAndImages(profileAddress)
    profileImageUrl.value = await getCachedImageUrl(profile.value?.profileImage)
    backgroundImageUrl.value = await getCachedImageUrl(
      profile.value?.backgroundImage
    )
  })

  return {
    profile,
    profileImageUrl,
    backgroundImageUrl,
  }
}
