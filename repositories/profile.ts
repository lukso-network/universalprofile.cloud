import { Repository } from 'pinia-orm'

import { ProfileModel, ProfileWithImagesItem } from '@/models/profile'
import { ImageModel } from '@/models/image'

export class ProfileRepository extends Repository<ProfileModel> {
  getProfileAndImages(address: Address) {
    const profile = this.repo(ProfileModel).find(address)
    const profileImage =
      profile?.profileImage && this.repo(ImageModel).find(profile.profileImage)
    const backgroundImage =
      profile?.backgroundImage &&
      this.repo(ImageModel).find(profile.backgroundImage)

    return {
      ...profile,
      profileImage,
      backgroundImage,
    } as ProfileWithImagesItem
  }
}
