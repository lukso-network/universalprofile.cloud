export const setupViewedAssets = async (profileAddress: Address) => {
  const { setStatus } = useViewedProfileStore()

  try {
    const { setOwnedAssets, setStatus, setCreatedAssets } =
      useViewedProfileStore()
    const { fetchAssets } = useErc725()

    setStatus('isAssetLoading', true)
    setOwnedAssets(await fetchAssets(profileAddress, 'LSP5ReceivedAssets[]'))
    setCreatedAssets(await fetchAssets(profileAddress, 'LSP12IssuedAssets[]'))
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isAssetLoading', false)
  }
}
