import { INJECTED_PROVIDER } from '@/shared/provider'

const connect = async () => {
  const { isWalletConnect, isMobile } = storeToRefs(useAppStore())
  const { connect: connectWalletConnect } = useWalletConnectProvider()
  const { connect: connectBrowserExtension } = useBrowserExtensionProvider()

  if (isWalletConnect.value || isMobile.value) {
    await connectWalletConnect()
    return
  }

  await connectBrowserExtension()
}

const disconnect = () => {
  const { removeItem } = useLocalStorage()
  const { connectedProfileAddress, isWalletConnect, walletConnectProvider } =
    storeToRefs(useAppStore())

  // disconnect WalletConnect
  if (isWalletConnect.value) {
    walletConnectProvider.value?.disconnect()
    isWalletConnect.value = false
  }

  connectedProfileAddress.value = undefined
  removeItem(STORAGE_KEY.CONNECTION_EXPIRY)
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
