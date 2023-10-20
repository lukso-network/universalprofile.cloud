import { SetupViewedProfileError } from '@/shared/errors'

export const loadViewedProfile = async (profileAddress: Address) => {
  const { setStatus, setProfile } = useViewedProfileStore()

  try {
    setStatus('isProfileLoading', true)
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
