// id of the network to use by default
export const DEFAULT_NETWORK_ID = 'testnet'

// list of supported networks
export const NETWORKS: NetworkInfo[] = [
  {
    id: 'testnet',
    name: 'LUKSO Testnet',
    chainId: '0x1069',
    rpcHttp: 'https://rpc.testnet.lukso.network',
    ipfsUrl: 'https://2eff.lukso.dev/ipfs/',
  },
  {
    id: 'mainnet',
    name: 'LUKSO Mainnet',
    chainId: '0x2a',
    rpcHttp: 'https://rpc.mainnet.lukso.network',
    ipfsUrl: 'https://2eff.lukso.dev/ipfs/',
  },
]

// name of default modal component name
export const MODAL_DEFAULT_TEMPLATE = 'default'

// global provider object injected by browser extension
export const INJECTED_PROVIDER = window.ethereum
