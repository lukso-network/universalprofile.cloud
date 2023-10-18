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
      Object.assign(profile, newProfile)
    },

    clearProfile() {
      Object.assign(profile, {})
    },

    reloadProfile(newProfile: Profile) {
      this.clearProfile()
      assertAddress(newProfile.address, 'profile')
      profile.address = newProfile.address
      this.setProfile(newProfile)
    },
  }
}
