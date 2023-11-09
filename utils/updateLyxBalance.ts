export const updateLyxBalance = async (profileAddress?: Address) => {
  const { getBalance } = useWeb3(PROVIDERS.RPC)
  assertString(profileAddress)
  const balance = await getBalance(profileAddress)

  useRepo(ProfileModel).where('address', profileAddress).update({ balance })
}
