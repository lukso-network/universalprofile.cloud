import { useQueries } from '@tanstack/vue-query'

function getIssuedAssets(profiles: MaybeRef<Address[]>) {
  const { currentNetwork } = storeToRefs(useAppStore())
  const queries = computed(() => {
    const chainId = currentNetwork.value?.chainId || ''
    return (isRef(profiles) ? profiles.value : profiles).flatMap(profile => {
      return profile
        ? [
            queryGetData({
              chainId,
              address: profile as Address,
              keyName: 'LSP12IssuedAssets[]',
            }),
          ]
        : []
    })
  })
  return useQueries({
    queries,
    combine: results => {
      const output = Object.fromEntries(
        results.map((result, index) => {
          const set = new Set((result.data as Address[]) || [])
          const profile = (isRef(profiles) ? profiles.value : profiles)[index]
          return [profile, set]
        })
      )
      return output
    },
  })
}

export function useIssuedAssets() {
  return {
    getIssuedAssets,
    validateAssets(
      _profiles: MaybeRef<Address[]>,
      _assetAddress?: MaybeRef<Address | undefined>
    ): ComputedRef<Map<Address, boolean>> {
      const profiles = computed(() =>
        isRef(_profiles) ? _profiles.value : _profiles
      )
      const assetAddress = computed(() =>
        isRef(_assetAddress) ? _assetAddress.value : _assetAddress
      )
      const issuedAssets = getIssuedAssets(profiles)
      return computed(() => {
        return new Map<Address, boolean>(
          Object.entries(issuedAssets.value || {})?.map(([address, assets]) => [
            address as Address,
            assets.has(assetAddress.value || '0x'),
          ])
        )
      })
    },
  }
}
