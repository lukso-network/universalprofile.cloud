export const useViewedProfile = () => {
  const viewedProfile = useProfile().viewedProfile()

  return {
    viewedProfile,
  }
}
