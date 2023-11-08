import { AssetFilter } from '@/types/assets'
import { Modal } from '@/types/modal'
import { NetworkInfo } from '@/types/network'

/**
 * App store
 * Keeps the information about app
 *
 */
export const useAppStore = defineStore(
  'app',
  () => {
    const networks = ref<NetworkInfo[]>(NETWORKS)
    const selectedChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)
    const modal = ref<Modal>()
    const connectedProfileAddress = ref<Address>()
    const assetFilter = ref<AssetFilter>(AssetFilter.owned)

    // statuses
    const isConnecting = ref(false)
    const isLoadingProfile = ref(false)
    const isLoadingAssets = ref(false)
    const isLoadedApp = ref(false)

    // --- getters

    const getNetwork = (chainId: string): NetworkInfo => {
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

    const currentNetwork = computed(() => getNetwork(selectedChainId.value))

    const isConnected = computed(() => !!connectedProfileAddress.value)

    const isTestnet = computed(() => selectedChainId.value === TESTNET_CHAIN_ID)

    // --- actions

    const setModal = (newModal: Modal) => {
      modal.value = newModal
    }

    return {
      networks,
      selectedChainId,
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
      isTestnet,
    }
  },
  {
    persist: {
      paths: ['connectedProfileAddress', 'assetFilter', 'selectedChainId'],
      key: STORAGE_KEY.APP_STORE,
    },
  }
)
