export const getCurrentProfileAddress = (): Address | never => {
  const profileAddress = useRouter().currentRoute.value.params?.profileAddress
  assertAddress(profileAddress)
  return profileAddress
}
