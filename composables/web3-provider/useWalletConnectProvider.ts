import { EthereumProvider as WalletConnectProvider } from '@walletconnect/ethereum-provider'

import type EthereumProvider from '@walletconnect/ethereum-provider'

const initProvider = async () => {
  const { walletConnectProvider: provider, selectedChainId: chainId } =
    storeToRefs(useAppStore())
  const numberChainId = hexToNumber(chainId.value) as number
  const rpcNode = (await selectRpcNode())?.host as string

  provider.value = await WalletConnectProvider.init({
    projectId: '68cee9cbecf1293488f207237e89f337',
    metadata: {
      name: 'Universal Profiles',
      description:
        'Explore Universal Profiles and view all your assets in one place as well as send and receive tokens to other Universal Profile users.',
      url: BASE_DAPP_URL,
      icons: ['https://universaleverything.io/favicon.png'],
    },
    showQrModal: false,
    optionalChains: [numberChainId],
    rpcMap: {
      [numberChainId]: rpcNode,
    },
  })
}

const connect = async () => {
  const {
    walletConnectProvider: provider,
    connectedProfileAddress,
    walletConnectSession,
    isWalletConnect,
  } = storeToRefs(useAppStore())
  const { setConnectionExpiry } = useConnectionExpiry()
  const { addWeb3 } = useWeb3Store()
  const { disconnect } = useBaseProvider()
  const { showModal, modal, closeModal } = useModal()
  const { formatMessage } = useIntl()
  const route = useRoute()

  try {
    if (isWalletConnect.value) {
      await provider.value?.enable()
    } else {
      await provider.value?.connect()
    }

    walletConnectSession.value = provider.value?.session
    const result = (await provider.value?.request({
      method: 'eth_requestAccounts',
    })) as Address[]

    if (!result) {
      throw new NoAccountsError()
    }

    const [address] = result
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

    // set web3 for wallet connect
    if (provider.value) {
      addWeb3(PROVIDERS.WALLET_CONNECT, provider.value as EthereumProvider)
    }
  } catch (error) {
    console.error(error)
    disconnect()
    showModal({
      data: {
        title: formatMessage('web3_connect_error_title'),
        message: getErrorMessage(error),
      },
    })
  }
}

export const useWalletConnectProvider = () => {
  return {
    initProvider,
    connect,
  }
}
