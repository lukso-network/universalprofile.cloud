import { Modal } from '@/types/modal'
import { NetworkInfo, NetworkId } from '@/types/network'

/**
 * App store
 * Keeps the information about app non persistent state
 *
 */
export const useAppStore = defineStore('app', () => {
  const networks = ref<NetworkInfo[]>(NETWORKS)
  const selectedNetwork = ref<NetworkId>(DEFAULT_NETWORK_ID)
  const modal = ref<Modal>()

  // --- getters

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

  const currentNetwork = computed(() => getNetwork(selectedNetwork.value))

  // --- actions

  const setModal = (newModal: Modal) => {
    modal.value = newModal
  }

  return {
    networks,
    selectedNetwork,
    getNetwork,
    modal,
    setModal,
    currentNetwork,
  }
})
