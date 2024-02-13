import { Repository } from 'pinia-orm'

import { type Profile, ProfileModel } from '@/models/profile'
// import { ImageModel } from '@/models/image'

export class ProfileRepository extends Repository<ProfileModel> {
  getProfile(address: Address) {
    const { selectedChainId } = storeToRefs(useAppStore())
    const profile = this.repo(ProfileModel)
      .where('chainId', selectedChainId.value)
      .find(address)

    return profile
  }

  saveProfile(profile?: Profile) {
    if (!profile) {
      return
    }

    this.repo(ProfileModel).save(profile)
  }
}
