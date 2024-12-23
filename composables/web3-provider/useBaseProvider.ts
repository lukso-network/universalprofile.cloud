import { INJECTED_PROVIDER } from '@/shared/provider'

const connect = async () => {
  const { isWalletConnect, isMobile, walletConnectProvider } =
    storeToRefs(useAppStore())
  const {
    connect: connectWalletConnect,
    initProvider: initWalletConnectProvider,
  } = useWalletConnectProvider()
  const { connect: connectBrowserExtension } = useBrowserExtensionProvider()

  if (isWalletConnect.value || isMobile.value) {
    await initWalletConnectProvider()
    walletConnectProvider.value?.on('display_uri', (data: string) => {
      const deepLink = walletConnectDeepLinkUrl(data, {
        withRedirectUrl: true,
      })
      navigateTo(deepLink, { external: true })
    })
    await connectWalletConnect()
    return
  }

  await connectBrowserExtension()
}

const disconnect = () => {
  const { removeItem } = useLocalStorage()
  const {
    connectedProfileAddress,
    isWalletConnect,
    walletConnectProvider,
    walletConnectSession,
  } = storeToRefs(useAppStore())
  const { isEditingGrid } = storeToRefs(useGridStore())

  // disconnect WalletConnect
  if (isWalletConnect.value) {
    walletConnectProvider.value?.disconnect()
    walletConnectSession.value = undefined
  }

  // reset connected profile address
  connectedProfileAddress.value = undefined
  // remove connection expiry
  removeItem(STORAGE_KEY.CONNECTION_EXPIRY)
  // exit edit mode for grid
  isEditingGrid.value = false
}

/**
 * Get current provider.
 * WalletConnect provider is a priority, if it is not available fallback to injected provider.
 *
 * @returns
 */
const currentProvider = computed(() => {
  const { walletConnectProvider, isWalletConnect } = storeToRefs(useAppStore())

  if (isWalletConnect.value) {
    return walletConnectProvider.value
  }

  return INJECTED_PROVIDER
})

/**
 * Get web3 instance based on the current provider.
 */
const providerWeb3Instance = computed(() => {
  const { isWalletConnect } = storeToRefs(useAppStore())

  if (isWalletConnect.value) {
    return useWeb3(PROVIDERS.WALLET_CONNECT)
  }

  return useWeb3(PROVIDERS.INJECTED)
})

export const useBaseProvider = () => {
  return {
    connect,
    disconnect,
    currentProvider,
    providerWeb3Instance,
  }
}
