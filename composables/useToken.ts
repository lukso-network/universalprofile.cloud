export function useToken() {
  return (asset?: MaybeRef<Asset | null | undefined>) => {
    const { isRpc } = useDataProvider()

    if (isRpc) {
      return useTokenRpc()(asset)
    }

    return useTokenGraph()(asset)
  }
}
