export const useProfileStore = defineStore('profile', () => {
  const address = ref<Address>()
  const name = ref<string>()
  const backgroundUrl = ref<string>()
  const profileUrl = ref<string>()

  const setAddress = (newAddress: Address) => {
    address.value = newAddress
  }

  return {
    address,
    setAddress,
    name,
    backgroundUrl,
    profileUrl,
  }
})
