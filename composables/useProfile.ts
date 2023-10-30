import { Profile } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useProfile = (
  profileAddress?: Address | { address?: Address }
) => {
  const profileRepo = useRepo(ProfileRepository)
  let address: Address | undefined
  const profile = ref<Profile>()

  watchEffect(async () => {
    if (profileAddress) {
      if (typeof profileAddress === 'string') {
        address = profileAddress
      } else {
        address = profileAddress?.address
      }
    }

    if (!address) {
      return
    }

    const storeProfile = profileRepo.getProfileAndImages(address)
    profile.value = storeProfile
  })

  return {
    profile,
  }
}
