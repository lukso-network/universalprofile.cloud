import { toChecksumAddress } from 'web3-utils'

import { Profile } from '@/types/profile'

/**
 * Set of methods shared across profile stores
 *
 * @param profile - Profile object
 * @returns - methods
 */
export const useProfileBase = (profile: Profile) => {
  return {
    setProfile(newProfile: Profile) {
      assertAddress(newProfile.address, 'profile')
      const checksumAddress = toChecksumAddress(newProfile.address)
      assertAddress(checksumAddress, 'profile')
      newProfile.address = checksumAddress
      Object.assign(profile, newProfile)
    },

    clearProfile() {
      Object.assign(profile, {})
    },

    reloadProfile(newProfile: Profile) {
      this.clearProfile()
      this.setProfile(newProfile)
    },
  }
}
