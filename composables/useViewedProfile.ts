import { ProfileWithImagesItem } from '@/models/profile'
import { ProfileRepository } from '@/repositories/profile'

export const useViewedProfile = () => {
  const profileRepo = useRepo(ProfileRepository)
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = ref<ProfileWithImagesItem>()
  const { isLoadingProfile } = storeToRefs(useAppStore())

  watchEffect(async () => {
    if (!viewedProfileAddress) {
      return
    }

    let storeProfile = profileRepo.getProfileAndImages(viewedProfileAddress)

    if (!storeProfile.address) {
      isLoadingProfile.value = true // TODO check how works loading profile for first time
      await fetchProfile(viewedProfileAddress)
      storeProfile = profileRepo.getProfileAndImages(viewedProfileAddress)
      isLoadingProfile.value = false
    }
    viewedProfile.value = storeProfile
    console.log(storeProfile)
  })

  return {
    viewedProfile,
  }
}
