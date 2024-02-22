export const useAsset = (assetAddress: Address, _tokenId = '0x') => {
  // const { isConnected } = storeToRefs(useAppStore())
  const { connectedProfile } = useConnectedProfile()
  // const queryClient = useQueryClient()
  // const assetRepo = useRepo(AssetRepository)

  // const { isPending: isLoading, data: assets } = useQuery({
  //   queryKey: ['asset', assetAddress, tokenId],
  //   queryFn: async () =>
  //     await fetchAsset(assetAddress, connectedProfile.value?.address, [
  //       tokenId,
  //     ]).then(asset => {
  //       if (asset) {
  //         assetRepo.saveAssets(asset)
  //       }
  //       return asset
  //     }),
  // })

  // const asset = computed(() => assets.value?.[0])

  // const isOwned = computed(() => {
  //   return (
  //     isConnected.value &&
  //     connectedProfile &&
  //     asset.value?.address &&
  //     asset.value?.balance !== '0' &&
  //     connectedProfile.value?.receivedAssetAddresses?.includes(
  //       asset.value?.address
  //     )
  //   )
  // })

  // when we detect that user is connected we refetch the asset to update balance
  watch(connectedProfile, () => {
    if (connectedProfile.value?.address) {
      // queryClient.invalidateQueries({
      //   queryKey: ['asset', assetAddress, tokenId],
      // })
    }
  })

  return {
    asset: null,
    isLoading: false,
    isOwned: false,
  }
}
