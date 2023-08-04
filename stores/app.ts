import { DEFAULT_NETWORK_ID, NETWORKS } from '@/shared/config'

export const useAppStore = defineStore('app', () => {
  const networks = ref<NetworkInfo[]>(NETWORKS)
  const selectedNetwork = ref<NetworkId>(DEFAULT_NETWORK_ID)

  const getNetwork = (networkId: NetworkId): NetworkInfo => {
    const network = networks.value.find(network => network.id === networkId)

    // fallback to default network
    if (!network) {
      return networks.value.find(
        network => network.id === DEFAULT_NETWORK_ID
      ) as NetworkInfo
    }

    return network
  }

  return {
    networks,
    selectedNetwork,
    getNetwork,
  }
})
