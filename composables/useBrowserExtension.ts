const openStoreLink = () => {
  const storeLink = browserInfo().storeLink

  window.open(storeLink, '_blank')
}

const setConnectionExpiry = () => {
  const currentDate = Date.now()
  const expiryDate = currentDate + CONNECTION_EXPIRY_TIME_MS

  setItem(STORAGE_KEY.CONNECTION_EXPIRY, expiryDate.toString())
}

const connect = async () => {
  const { showModal } = useModal()
  const { formatMessage } = useIntl()
  const { connectedProfileAddress, isConnecting } = storeToRefs(useAppStore())

  // when no extension installed we show modal
  if (!INJECTED_PROVIDER) {
    openStoreLink()

    return showModal({
      title: formatMessage('web3_connect_error_title'),
      message: formatMessage('web3_connect_no_extension'),
    })
  }

  isConnecting.value = true

  try {
    const { accounts, requestAccounts } = useWeb3(PROVIDERS.INJECTED)
    const reconnectAddress = getItem(STORAGE_KEY.RECONNECT_ADDRESS)

    let address: Address | undefined

    if (reconnectAddress) {
      address = await accounts()
    } else {
      ;[address] = await requestAccounts()
    }

    assertAddress(address, 'connection')
    connectedProfileAddress.value = address
    setConnectionExpiry()
  } catch (error: any) {
    console.error(error)
    disconnect()

    showModal({
      title: formatMessage('web3_connect_error_title'),
      message: getConnectionErrorMessage(error),
    })
  } finally {
    isConnecting.value = false
  }
}

const disconnect = () => {
  const { removeItem } = useLocalStorage()
  const { connectedProfileAddress } = storeToRefs(useAppStore())

  connectedProfileAddress.value = undefined
  removeItem(STORAGE_KEY.CONNECTION_EXPIRY)
  removeItem(STORAGE_KEY.RECONNECT_ADDRESS)
}

const handleAccountsChanged = async (accounts: string[]) => {
  const { connectedProfileAddress, isConnected } = storeToRefs(useAppStore())

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

    // TODO check how changing accounts work on different pages if redirect is needed
    // try {
    //   await navigateTo(profileRoute(address))
    // } catch (error) {
    //   console.error(error)
    // }
  } else {
    // when user remove connection with dApp we disconnect
    disconnect()
  }
}

const handleDisconnect = () => {
  location.reload()
}

const addProviderEvents = async (provider: any) => {
  provider?.on?.('accountsChanged', handleAccountsChanged)
  provider?.on?.('disconnect', handleDisconnect)
}

const removeProviderEvents = async (provider: any) => {
  provider?.removeListener?.('accountsChanged', handleAccountsChanged)
  provider?.removeListener?.('disconnect', handleAccountsChanged)
}

const isUniversalProfileExtension = () => {
  return !!INJECTED_PROVIDER
}

export const useBrowserExtension = () => {
  return {
    connect,
    disconnect,
    addProviderEvents,
    removeProviderEvents,
    isUniversalProfileExtension,
  }
}
