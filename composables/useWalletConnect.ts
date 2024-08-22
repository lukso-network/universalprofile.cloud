import { EthereumProvider } from '@walletconnect/ethereum-provider'

const initProvider = async () => {
  const { walletConnectProvider: provider } = storeToRefs(useAppStore())

  provider.value = await EthereumProvider.init({
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

const connect = async () => {
  const { walletConnectProvider: provider } = storeToRefs(useAppStore())
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  const { setConnectionExpiry } = useConnectionExpiry()
  const { addWeb3 } = useWeb3Store()

  await provider.value?.connect()

  const result = (await provider.value?.request({
    method: 'eth_requestAccounts',
  })) as Address[]
  const [address] = result
  connectedProfileAddress.value = address
  setConnectionExpiry()
  navigateTo(profileRoute(address))

  if (provider.value) {
    addWeb3(PROVIDERS.INJECTED, provider.value)
  }
}

export const useWalletConnect = () => {
  return {
    initProvider,
    connect,
  }
}
