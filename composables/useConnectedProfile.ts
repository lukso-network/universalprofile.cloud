import { ProfileRepository } from '@/repositories/profile'

import type { Profile } from '@/models/profile'

export const useConnectedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  const connectedProfile = ref<Profile>()

  watchEffect(async () => {
    if (!connectedProfileAddress.value) {
      return
    }

    connectedProfile.value = profileRepo.getProfile(
      connectedProfileAddress.value
    )
  })

  return {
    connectedProfile,
  }
}
