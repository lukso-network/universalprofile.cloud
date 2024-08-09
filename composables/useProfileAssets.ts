export function useProfileAssets() {
  return (profileAddress?: MaybeRef<Address | null>) => {
    const { isRpc } = storeToRefs(useAppStore())

    if (isRpc.value) {
      return useProfileAssetsRpc()(profileAddress)
    }

    return useProfileAssetsGraph()({ profileAddress })
  }
}
