import { Profile } from '@/models/profile'
import { Image } from '@/models/image'
import { ImageRepository } from '@/repositories/image'

export const useProfile = (
  profileAddress?: Address | { address?: Address }
) => {
  const imageRepo = useRepo(ImageRepository)
  const profileRepo = useRepo(ProfileModel)
  let address: Address | undefined

  if (profileAddress) {
    if (typeof profileAddress === 'string') {
      address = profileAddress
    } else {
      address = profileAddress?.address
    }
  }

  const profile = ref<Profile>()
  const backgroundImage = ref<Image>()
  const profileImage = ref<Image>()

  watchEffect(() => {
    profile.value = address && profileRepo.find(address)
    backgroundImage.value = imageRepo.getImage(profile.value?.backgroundImageId)
    profileImage.value = imageRepo.getImage(profile.value?.profileImageId)
  })

  return {
    profile,
    backgroundImage,
    profileImage,
  }
}
