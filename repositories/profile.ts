import { Repository } from 'pinia-orm'

import { Profile, ProfileModel } from '@/models/profile'
import { ImageModel } from '@/models/image'

export class ProfileRepository extends Repository<ProfileModel> {
  getProfileAndImages(address: Address) {
    const profile = this.repo(ProfileModel).find(address)

    if (!profile) {
      return
    }

    const profileImage =
      profile?.profileImageId &&
      this.repo(ImageModel).find(profile.profileImageId)
    const backgroundImage =
      profile?.backgroundImageId &&
      this.repo(ImageModel).find(profile.backgroundImageId)

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
