import { Profile } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useProfile = (profileAddress?: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = ref<Profile>()

  watchEffect(async () => {
    if (!profileAddress) {
      return
    }

    const storeProfile = profileRepo.getProfileAndImages(profileAddress)
    profile.value = storeProfile
  })

  return {
    profile,
  }
}
