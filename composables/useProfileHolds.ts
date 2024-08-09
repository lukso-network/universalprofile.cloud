export function useProfileHolds() {
  return (profileAddress?: MaybeRef<Address | null>) => {
    const { isRpc } = storeToRefs(useAppStore())

    if (isRpc.value) {
      return useProfileAssetsRpc()(profileAddress)
    }

    return useProfileHoldsGraph()({ profileAddress })
  }
}
