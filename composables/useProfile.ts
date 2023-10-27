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

  const profile = computed(() => {
    return address && profileRepo.find(address)
  })

  const backgroundImage = computed(() => {
    return imageRepo.getImage(profile.value?.backgroundImageId)
  })

  const profileImage = computed(() => {
    return imageRepo.getImage(profile.value?.profileImageId)
  })

  return {
    profile,
    backgroundImage,
    profileImage,
  }
}
