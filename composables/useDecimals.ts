import { useQuery } from '@tanstack/vue-query'

export function useDecimals() {
  return (address?: Address) => {
    if (!address) {
      return
    }

    const { currentNetwork } = storeToRefs(useAppStore())
    const chainId = currentNetwork.value?.chainId

    return useQuery(
      queryCallContract<number>({
        chainId,
        address,
        method: 'decimals()',
      })
    )
  }
}
