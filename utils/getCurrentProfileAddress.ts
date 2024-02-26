export const getCurrentProfileAddress = () => {
  return useRouter().currentRoute.value.params?.profileAddress
}
