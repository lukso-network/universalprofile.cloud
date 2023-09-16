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
    navigateTo(notFoundRoute())
  } finally {
    setStatus('isProfileLoading', false)
  }
}
