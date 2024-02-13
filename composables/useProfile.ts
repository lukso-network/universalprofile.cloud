import { ProfileRepository } from '@/repositories/profile'

import type { Profile } from '@/models/profile'

export const useProfile = (profileAddress?: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = ref<Profile>()

  watchEffect(async () => {
    if (!profileAddress) {
      return
    }

    profile.value = profileRepo.getProfile(profileAddress)
  })

  return {
    profile,
  }
}
