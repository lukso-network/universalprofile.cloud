export function useAsset() {
  return (
    address?: MaybeRef<Address | undefined>,
    tokenId?: MaybeRef<string | undefined>
  ) => {
    const { isRpc } = storeToRefs(useAppStore())

    if (isRpc.value) {
      return useAssetRpc()(address, tokenId)
    }

    return useAssetGraph()(address, tokenId)
  }
}
