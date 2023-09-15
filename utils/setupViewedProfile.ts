export const setupViewedProfile = async () => {
  const {
    setStatus,
    profile: viewedProfile,
    setProfile,
  } = useViewedProfileStore()

  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    setStatus('isProfileLoading', true)
    assertAddress(profileAddress, 'wallet')
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
