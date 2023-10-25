export const getCurrentProfileAddress = (): Address | void => {
  const profileAddress = useRouter().currentRoute.value.params?.profileAddress

  try {
    assertAddress(profileAddress)
    return profileAddress
  } catch (error) {
    return
  }
}
