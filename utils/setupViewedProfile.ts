import { SetupViewedProfileError } from '@/shared/errors'

export const setupViewedProfile = async (profileAddress: Address) => {
  const {
    setStatus,
    profile: viewedProfile,
    setProfile,
  } = useViewedProfileStore()

  try {
    setStatus('isProfileLoading', true)
    viewedProfile.address = profileAddress
    const profile = await fetchProfile(profileAddress)
    setProfile(profile)
  } catch (error) {
    console.error(error)

    if (error instanceof InterfaceError) {
      navigateTo(notFoundRoute())
    }

    throw new SetupViewedProfileError()
  } finally {
    setStatus('isProfileLoading', false)
  }
}
