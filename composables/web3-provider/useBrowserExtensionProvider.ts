import { INJECTED_PROVIDER } from '@/shared/provider'

import type { ProviderAPI } from '@/types/provider'

const openStoreLink = () => {
  const storeLink = browserInfo().storeLink

  navigateTo(storeLink, {
    external: true,
    open: {
      target: '_blank',
    },
  })
}

const connect = async () => {
  const { showModal, closeModal, modal } = useModal()
  const { formatMessage } = useIntl()
  const { setConnectionExpiry } = useConnectionExpiry()
  const { connectedProfileAddress, isConnecting } = storeToRefs(useAppStore())
  const route = useRoute()
  const { disconnect } = useBaseProvider()

  try {
    // check if we are on the right network
    await checkNetwork(true)

    // when no extension installed we show modal
    if (!INJECTED_PROVIDER) {
      openStoreLink()

      return showModal({
        data: {
          title: formatMessage('web3_connect_error_title'),
          message: formatMessage('web3_connect_no_extension'),
        },
      })
    }

    isConnecting.value = true
    const { requestAccounts } = useWeb3(PROVIDERS.INJECTED)
    const [address] = await requestAccounts()

    assertAddress(address, 'connection')
    connectedProfileAddress.value = address
    setConnectionExpiry()

    // close connect modal if it's open
    if (modal?.template === 'ConnectWallet') {
      closeModal()
    }

    // when we connect on the landing page we redirect to profile
    if (route.name === 'index') {
      navigateTo(profileRoute(address))
    }
  } catch (error: unknown) {
    console.error(error)
    disconnect()
    showModal({
      data: {
        title: formatMessage('web3_connect_error_title'),
        message: getErrorMessage(error),
      },
    })

    // TODO: we might want to show toast message when modal is open because then we can't provide error feedback to user
  } finally {
    isConnecting.value = false
  }
}

const handleAccountsChanged = async (accounts: string[]) => {
  const { connectedProfileAddress, isConnected } = storeToRefs(useAppStore())
  const { disconnect } = useBaseProvider()

  // handle account change only for connected users
  if (!isConnected.value) {
    return
  }

  if (accounts.length) {
    const address = accounts[0]
    assertAddress(address, 'profile')

    // if user is already connected we need to update Local Storage key
    if (isConnected.value) {
      connectedProfileAddress.value = address
    }

    await navigateTo(profileRoute(address))
  } else {
    // when user remove connection with dApp we disconnect
    disconnect()
  }
}

const handleDisconnect = () => {
  location.reload()
}

const handleChainChanged = (network: { chainId: string }) => {
  const { showModal } = useModal()
  const { getNetworkByChainId, currentNetwork } = useAppStore()
  const getNetwork = getNetworkByChainId(network.chainId)

  if (currentNetwork.chainId !== network.chainId) {
    showModal({
      template: 'SwitchApplicationNetwork',
      data: {
        name: getNetwork.name,
        chainId: network.chainId,
      },
    })
  }
}

const addProviderEvents = async (provider: ProviderAPI) => {
  provider?.on?.('accountsChanged', handleAccountsChanged)
  provider?.on?.('disconnect', handleDisconnect)
  provider?.on?.('chainChanged', handleChainChanged)
}

const removeProviderEvents = async (provider: ProviderAPI) => {
  provider?.off?.('accountsChanged', handleAccountsChanged)
  provider?.off?.('disconnect', handleDisconnect)
  provider?.off?.('chainChanged', handleChainChanged)
}

const isUniversalProfileExtension = () => {
  return !!INJECTED_PROVIDER
}

export const useBrowserExtensionProvider = () => {
  return {
    connect,
    addProviderEvents,
    removeProviderEvents,
    isUniversalProfileExtension,
  }
}
