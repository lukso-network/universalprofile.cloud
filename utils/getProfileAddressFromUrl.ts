export const getProfileAddressFromUrl = () => {
  // get profile address from router (url)
  const router = useRouter()
  const { setAddress } = useProfileStore()
  const profileAddress = router.currentRoute.value.params.address

  try {
    // put address in store if it is valid
    assertAddress(profileAddress)
    // TODO check if it's valid UP
    setAddress(profileAddress)
  } catch (e) {
    console.error(e)
  }
}
