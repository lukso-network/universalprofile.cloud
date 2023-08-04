export const DEFAULT_NETWORK_ID = 'testnet'

export const NETWORKS: NetworkInfo[] = [
  {
    id: 'testnet',
    name: 'LUKSO Testnet',
    chainId: '0x1069',
    rpcHttp: 'https://rpc.testnet.lukso.gateway.fm',
    ipfsUrl: 'https://2eff.lukso.dev/ipfs/',
  },
  {
    id: 'mainnet',
    name: 'LUKSO Mainnet',
    chainId: '0x2a',
    rpcHttp: 'https://rpc.lukso.gateway.fm',
    ipfsUrl: 'https://2eff.lukso.dev/ipfs/',
  },
]
