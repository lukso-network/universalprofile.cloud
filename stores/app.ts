import type { Modal } from '@/types/modal'
import type { NetworkId, NetworkInfo } from '@/types/network'

const FETCH_DATA_PROVIDERS = ['rpc', 'graph']
type FetchDataProvider = (typeof FETCH_DATA_PROVIDERS)[number]

/**
 * App store
 * Keeps the information about app
 *
 */
export const useAppStore = defineStore(
  'app',
  () => {
    const networkConfig = useNetworkConfig()
    const networks = ref<NetworkInfo[]>(networkConfig)
    const selectedChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)
    const modal = ref<Modal>()
    const connectedProfileAddress = ref<Address>()
    const fetchDataProvider = ref<FetchDataProvider>('graph')

    // statuses
    const isConnecting = ref(false)
    const isLoadedApp = ref(false)
    const isSearchOpen = ref(false)

    // --- getters

    const getNetworkByChainId = (chainId: string): NetworkInfo => {
      const network = networks.value.find(
        network => network.chainId === chainId
      )

      // fallback to default network
      if (!network) {
        return networks.value.find(
          network => network.chainId === DEFAULT_NETWORK_CHAIN_ID
        ) as NetworkInfo
      }

      return network
    }

    const getNetworkById = (id: NetworkId): NetworkInfo => {
      const network = networks.value.find(network => network.id === id)

      if (!network) {
        return networks.value.find(
          network => network.chainId === DEFAULT_NETWORK_CHAIN_ID
        ) as NetworkInfo
      }

      return network
    }

    const currentNetwork = computed(() =>
      getNetworkByChainId(selectedChainId.value)
    )

    const isConnected = computed(() => !!connectedProfileAddress.value)

    const isTestnet = computed(() => selectedChainId.value === TESTNET_CHAIN_ID)

    const isRpc = computed(() => fetchDataProvider.value === 'rpc')

    const isGraph = computed(() => fetchDataProvider.value === 'graph')

    // --- actions

    const setModal = (newModal: Modal) => {
      modal.value = newModal
    }

    return {
      networks,
      selectedChainId,
      getNetworkByChainId,
      getNetworkById,
      modal,
      setModal,
      currentNetwork,
      connectedProfileAddress,
      isConnected,
      isConnecting,
      isLoadedApp,
      isTestnet,
      isSearchOpen,
      isRpc,
      isGraph,
      fetchDataProvider,
    }
  },
  {
    persist: {
      paths: [
        'connectedProfileAddress',
        'selectedChainId',
        'fetchDataProvider',
      ],
      key: STORAGE_KEY.APP_STORE,
    },
  }
)
