export const useProtectedRoute = () => {
  const { isConnected } = storeToRefs(useAppStore())
  const profileAddress = useRouter().currentRoute.value.params?.profileAddress

  watchEffect(() => {
    if (isConnected.value) {
      return
    }

    // if we are in profile context we know then redirect to that profile
    if (profileAddress) {
      return navigateTo(profileRoute(profileAddress))
    }

    navigateTo(homeRoute())
  })
}
