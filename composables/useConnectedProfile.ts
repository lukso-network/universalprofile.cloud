import { ProfileRepository } from '@/repositories/profile'
import { Profile } from '@/models/profile'

export const useConnectedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  const connectedProfile = ref<Profile>()
  const profileImageUrl = ref<string>()
  const backgroundImageUrl = ref<string>()

  watchEffect(async () => {
    if (!connectedProfileAddress.value) {
      return
    }

    connectedProfile.value = profileRepo.getProfileAndImages(
      connectedProfileAddress.value
    )
    profileImageUrl.value = await getCachedImageUrl(
      connectedProfile.value?.profileImage
    )
    backgroundImageUrl.value = await getCachedImageUrl(
      connectedProfile.value?.backgroundImage
    )
  })

  return {
    connectedProfile,
    profileImageUrl,
    backgroundImageUrl,
  }
}
