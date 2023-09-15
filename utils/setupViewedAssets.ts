export const setupViewedAssets = async () => {
  const { setStatus } = useViewedProfileStore()

  try {
    const { profile, setOwnedAssets, setStatus, setCreatedAssets } =
      useViewedProfileStore()
    const { fetchAssets } = useErc725()

    setStatus('isAssetLoading', true)
    assertNotUndefined(profile.address)

    setOwnedAssets(await fetchAssets(profile.address, 'LSP5ReceivedAssets[]'))
    setCreatedAssets(await fetchAssets(profile.address, 'LSP12IssuedAssets[]'))
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isAssetLoading', false)
  }
}
