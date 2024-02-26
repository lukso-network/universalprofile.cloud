export const useViewedProfile = () => {
  const viewedProfileAddress = getCurrentProfileAddress()
  const viewedProfile = useProfile()(viewedProfileAddress)

  return {
    viewedProfile,
  }
}
