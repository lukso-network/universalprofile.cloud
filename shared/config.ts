import { NetworkInfo } from '@/types/network'

// id of the network to use by default
export const DEFAULT_NETWORK_ID = 'testnet'

// list of supported networks
export const NETWORKS: NetworkInfo[] = [
  {
    id: 'testnet',
    name: 'LUKSO Testnet',
    chainId: '0x1069',
    rpcHttp: 'https://rpc.testnet.lukso.network',
    token: {
      symbol: 'LYXt',
      supply: 42_000_000,
      name: 'LUKSO',
    },
  },
  {
    id: 'mainnet',
    name: 'LUKSO Mainnet',
    chainId: '0x2a',
    rpcHttp: 'https://rpc.lukso.gateway.fm',
    token: {
      symbol: 'LYX',
      supply: 42_000_000,
      name: 'LUKSO',
    },
  },
]

// name of default modal component name
export const MODAL_DEFAULT_TEMPLATE = 'Default'

// global provider object injected by browser extension
export const INJECTED_PROVIDER = window?.lukso

// connection expiry time
export const CONNECTION_EXPIRY_TIME_MS = 1000 * 60 * 60 * 2 // 2 hours

// interval to check if the user is still connected
export const CONNECTION_EXPIRY_CHECK_INTERVAL_MS = 1000 * 10 // 10 seconds

// placeholder icon if asset icon is not available
export const ASSET_ICON_PLACEHOLDER_URL = '/images/token-default.svg'

// lyx token icon
export const ASSET_LYX_ICON_URL = '/images/lyx-token.svg'

// number of decimal places for LYX token
export const ASSET_LYX_DECIMALS = '18'

// url of the ipfs gateway
export const IPFS_URL = 'https://2eff.lukso.dev/ipfs/'

// testnet flag for the app
export const IS_TESTNET = true

// extension store links
export const EXTENSION_STORE_LINKS = {
  chrome:
    'https://chrome.google.com/webstore/detail/universal-profiles-testin/abpickdkkbnbcoepogfhkhennhfhehfn',
  brave:
    'https://chrome.google.com/webstore/detail/universal-profiles-testin/abpickdkkbnbcoepogfhkhennhfhehfn',
  edge: '',
  opera: '',
  safari: '',
  firefox: '',
}

// indexer params
export const INDEX_NAME = 'prod_testnet_universal_profiles'

// search params
export const SEARCH_RESULTS_LIMIT = 100

// base universalprofile address
export const BASE_UP_CLOUD_URL = 'https://universalprofile.cloud/'
