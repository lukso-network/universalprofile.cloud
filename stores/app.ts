import { useWindowSize } from '@vueuse/core'

import type { Modal } from '@/types/modal'
import type { NetworkId, NetworkInfo } from '@/types/network'
import type EthereumProvider from '@walletconnect/ethereum-provider'

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
    const modal = ref<Modal>()

    // network
    const networkConfig = useNetworkConfig()
    const networks = ref<NetworkInfo[]>(networkConfig)
    const selectedChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)

    // connection
    const connectedProfileAddress = ref<Address>()
    const walletConnectProvider = ref<EthereumProvider | undefined>()
    const walletConnectSession = ref()

    // data provider
    const fetchDataProvider = ref<FetchDataProvider>('graph')
    const fetchDataProviderReset = ref(false)

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

    const isRpc = computed(
      () => fetchDataProvider.value === 'rpc' || isTestnet.value // TODO use RPC for Testnet until we have it indexed
    )

    const isGraph = computed(
      () => fetchDataProvider.value === 'graph' && !isTestnet.value // TODO use RPC for Testnet until we have it indexed
    )

    const isMobile = computed(() => {
      const { isMobile } = useDevice()
      const { width } = useWindowSize()
      const isSmallScreen = width.value < GRID_BREAKPOINT_PX

      // since device plugin check only User-Agent, we need to check also screen width
      return isMobile || isSmallScreen
    })

    const isMobileOrTablet = computed(() => {
      const { isMobileOrTablet } = useDevice()
      return isMobileOrTablet
    })

    const isSafari = computed(() => {
      const { isSafari } = useDevice()
      return isSafari
    })

    const isModalOpen = computed(() => {
      const route = useRoute()

      return !!route.query?.modalTemplate
    })

    const isWalletConnect = computed(() => !!walletConnectSession.value)

    const isViewingOwnProfile = computed(() => {
      const viewedProfileAddress = computed(() => getCurrentProfileAddress())

      return (
        // we need to compare lowercase addresses in case of checksummed addresses
        connectedProfileAddress.value?.toLowerCase() ===
        viewedProfileAddress.value?.toLowerCase()
      )
    })

    const isViewedProfileConnected = computed(() => {
      return isConnected.value && isViewingOwnProfile.value
    })

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
      isMobile,
      isMobileOrTablet,
      isSafari,
      isModalOpen,
      fetchDataProvider,
      fetchDataProviderReset,
      walletConnectProvider,
      isWalletConnect,
      walletConnectSession,
      isViewingOwnProfile,
      isViewedProfileConnected,
    }
  },
  {
    persist: {
      paths: [
        'connectedProfileAddress',
        'selectedChainId',
        'fetchDataProvider',
        'fetchDataProviderReset',
        'walletConnectSession',
      ],
      key: STORAGE_KEY.APP_STORE,
    },
  }
)
