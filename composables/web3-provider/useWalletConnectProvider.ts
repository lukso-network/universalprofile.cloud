import { EthereumProvider as WalletConnectProvider } from '@walletconnect/ethereum-provider'

import type EthereumProvider from '@walletconnect/ethereum-provider'

const initProvider = async () => {
  const { walletConnectProvider: provider } = storeToRefs(useAppStore())

  provider.value = await WalletConnectProvider.init({
    projectId: '68cee9cbecf1293488f207237e89f337',
    metadata: {
      name: 'Universal Profiles',
      description:
        'Explore Universal Profiles and view all your assets in one place as well as send and receive tokens to other Universal Profile users.',
      url: 'https://universalprofile.cloud/',
      icons: ['https://universalprofile.cloud/favicon.png'],
    },
    showQrModal: false,
    optionalChains: [42, 4201],
    rpcMap: {
      42: 'https://rpc1.mainnet.lukso.dev',
      4201: 'https://rpc.testnet.lukso.network',
    },
  })
}

const connect = async (requestAccounts = true) => {
  const {
    walletConnectProvider: provider,
    connectedProfileAddress,
    isWalletConnect,
    isConnecting,
  } = storeToRefs(useAppStore())
  const { setConnectionExpiry } = useConnectionExpiry()
  const { addWeb3 } = useWeb3Store()
  const { disconnect } = useBaseProvider()
  const { showModal } = useModal()
  const { formatMessage } = useIntl()

  try {
    isConnecting.value = true
    await provider.value?.connect()

    if (requestAccounts) {
      const result = (await provider.value?.request({
        method: 'eth_requestAccounts',
      })) as Address[]

      if (!result) {
        throw new NoAccountsError()
      }

      const [address] = result
      connectedProfileAddress.value = address
    }

    setConnectionExpiry()
    navigateTo(profileRoute(connectedProfileAddress.value))
    isWalletConnect.value = true

    if (provider.value) {
      addWeb3(PROVIDERS.WALLET_CONNECT, provider.value as EthereumProvider)
    }
  } catch (error) {
    console.error(error)
    disconnect()
    showModal({
      title: formatMessage('web3_connect_error_title'),
      message: getErrorMessage(error),
    })
  } finally {
    isConnecting.value = false
  }
}

/**
 * Reconnect WalletConnect but don't trigger request accounts
 */
const reconnect = async () => {
  connect(false)
}

/**
 * Parse deep link to be used by mobile app
 *
 * By default WalletConnect uses wc: prefix for deep linking, but this also works with
 * other wallets. We replace with own prefix to ensure it works with our app.
 *
 * @param data
 * @returns
 */
const deepLinkParser = (data: string) => {
  return data.replace('wc:', 'network.lukso.universalprofiles.ios:')
}

export const useWalletConnectProvider = () => {
  return {
    initProvider,
    connect,
    reconnect,
    deepLinkParser,
  }
}
