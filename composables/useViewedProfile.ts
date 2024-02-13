import { ProfileRepository } from '@/repositories/profile'

import type { Profile } from '@/models/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<Profile>()

  watchEffect(async () => {
    if (!viewedProfileAddress) {
      return
    }

    viewedProfile.value = profileRepo.getProfile(viewedProfileAddress)
  })

  return {
    viewedProfile,
  }
}
