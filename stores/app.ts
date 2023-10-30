import { AssetFilter } from '@/types/assets'
import { Modal } from '@/types/modal'
import { NetworkInfo, NetworkId } from '@/types/network'

/**
 * App store
 * Keeps the information about app
 *
 */
export const useAppStore = defineStore(
  'app',
  () => {
    const networks = ref<NetworkInfo[]>(NETWORKS)
    const selectedNetwork = ref<NetworkId>(DEFAULT_NETWORK_ID)
    const modal = ref<Modal>()
    const connectedProfileAddress = ref<Address>()
    const assetFilter = ref<AssetFilter>(AssetFilter.owned)

    // statuses
    const isConnecting = ref(false)
    const isLoadingProfile = ref(false)
    const isLoadingAssets = ref(false)
    const isLoadedApp = ref(false)

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

    const isConnected = computed(() => !!connectedProfileAddress.value)

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
      connectedProfileAddress,
      isConnected,
      isConnecting,
      isLoadingProfile,
      isLoadingAssets,
      isLoadedApp,
      assetFilter,
    }
  },
  {
    persist: {
      paths: ['connectedProfileAddress', 'assetFilter'],
      key: STORAGE_KEY.APP_STORE,
    },
  }
)
