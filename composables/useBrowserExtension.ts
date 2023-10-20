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
  const { setStatus, reloadProfile: reloadConnectedProfile } =
    useConnectedProfileStore()

  // when no extension installed we show modal
  if (!INJECTED_PROVIDER) {
    openStoreLink()

    return showModal({
      title: formatMessage('web3_connect_error_title'),
      message: formatMessage('web3_connect_no_extension'),
    })
  }

  setStatus('isConnecting', true)

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
    setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
    const profile = await fetchProfile(address)
    await setupViewedProfile(address)
    await setupViewedAssets(address)
    reloadConnectedProfile(profile)
    setStatus('isConnected', true)
    setConnectionExpiry()
    await navigateTo(profileRoute(address))
  } catch (error: any) {
    console.error(error)
    disconnect()

    // known errors
    if (error instanceof EoAError) {
      return showModal({
        title: formatMessage('web3_connect_error_title'),
        message: formatMessage('web3_eoa_error_message'),
      })
    }

    if (error instanceof InterfaceError) {
      return showModal({
        title: formatMessage('web3_connect_error_title'),
        message: formatMessage('web3_interface_error_message'),
      })
    }

    // errors that have a code or message
    if (error && error.code) {
      switch (error.code) {
        case 4001:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: formatMessage('web3_connect_error_rejected_request'),
          })

        case -32005:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: formatMessage('web3_connect_error_pending_request'),
          })
        default:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: error.message,
          })
      }
    }

    // unknowns errors
    return showModal({
      title: formatMessage('web3_connect_error_title'),
      message: formatMessage('web3_connect_error'),
    })
  } finally {
    setStatus('isConnecting', false)
  }
}

const disconnect = () => {
  const { setStatus } = useConnectedProfileStore()
  const { removeItem } = useLocalStorage()

  setStatus('isConnected', false)
  removeItem(STORAGE_KEY.CONNECTED_ADDRESS)
  removeItem(STORAGE_KEY.CONNECTION_EXPIRY)
  removeItem(STORAGE_KEY.RECONNECT_ADDRESS)
}

const handleAccountsChanged = async (accounts: string[]) => {
  const { status } = useConnectedProfileStore()

  // handle account change only for connected users
  if (!status.isConnected) {
    return
  }

  if (accounts.length) {
    const address = accounts[0]
    assertAddress(address, 'profile')

    // if user is already connected we need to update Local Storage key
    if (status.isConnected) {
      setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
    }

    try {
      await navigateTo(profileRoute(address))
      await setupViewedProfile(address)
      await setupViewedAssets(address)
    } catch (error) {
      console.error(error)
    }
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
