import { ProfileRepository } from '@/repositories/profile'
import { Profile } from '@/models/profile'

export const useConnectedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  const connectedProfile = ref<Profile>()

  watchEffect(async () => {
    if (!connectedProfileAddress.value) {
      return
    }

    let storeProfile = profileRepo.getProfileAndImages(
      connectedProfileAddress.value
    )

    if (!storeProfile) {
      await fetchProfile(connectedProfileAddress.value)
      storeProfile = profileRepo.getProfileAndImages(
        connectedProfileAddress.value
      )
    }

    connectedProfile.value = storeProfile
  })

  return {
    connectedProfile,
  }
}
