export const fetchProfileAddressFromUrl = () => {
  // get profile address from router (url)
  const router = useRouter()
  const { setAddress } = useProfileStore()
  const profileAddress = router.currentRoute.value.params.profileAddress

  // put address in store if it is valid
  assertAddress(profileAddress)
  // TODO check if it's valid UP
  setAddress(profileAddress)
}
