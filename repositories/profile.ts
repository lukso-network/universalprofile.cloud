import { Repository } from 'pinia-orm'

import { type Profile, ProfileModel } from '@/models/profile'
import { ImageModel } from '@/models/image'
import { ImageRepository } from './image'

export class ProfileRepository extends Repository<ProfileModel> {
  getProfileAndImages(address: Address) {
    const { selectedChainId } = storeToRefs(useAppStore())
    const profile = this.repo(ProfileModel)
      .where('chainId', selectedChainId.value)
      .find(address)

    if (!profile) {
      return
    }

    const profileImage =
      profile?.profileImageId &&
      this.repo(ImageRepository).getImage(profile.profileImageId)
    const backgroundImage =
      profile?.backgroundImageId &&
      this.repo(ImageRepository).getImage(profile.backgroundImageId)

    return {
      ...profile,
      profileImage,
      backgroundImage,
    } as Profile
  }

  saveProfile(profile?: Profile) {
    if (!profile) {
      return
    }

    const { profileImage, backgroundImage, ...plainProfile } = profile

    // save profile
    this.repo(ProfileModel).save(plainProfile)

    // save profile images
    profileImage && this.repo(ImageModel).save(profileImage)
    backgroundImage && this.repo(ImageModel).save(backgroundImage)
  }
}
