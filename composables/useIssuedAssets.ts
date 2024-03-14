import { useQueries } from '@tanstack/vue-query'

function getIssuedAssets(profiles: Address[]) {
  const { currentNetwork } = storeToRefs(useAppStore())
  const queries = computed(() => {
    const chainId = currentNetwork.value?.chainId || ''
    return profiles.flatMap(profile => {
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
      return results.map(result => new Set((result.data as Address[]) || []))
    },
  })
}

export function useIssuedAssets() {
  return {
    getIssuedAssets,
    validateAssets(profiles: Address[], assetAddress?: Address) {
      const issuedAssets = getIssuedAssets(profiles)
      return computed(() => {
        return issuedAssets.value?.map(assets =>
          assets.has(assetAddress || '0x')
        )
      })
    },
  }
}
