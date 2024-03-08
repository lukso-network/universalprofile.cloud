import { toWei } from 'web3-utils'

import type { NetworkInfo } from '@/types/network'

// chain id's
export const TESTNET_CHAIN_ID = '0x1069'
export const MAINNET_CHAIN_ID = '0x2a'
export const DEFAULT_NETWORK_CHAIN_ID = MAINNET_CHAIN_ID
export const SUPPORTED_NETWORK_IDS = ['mainnet', 'testnet'] as const

// list of supported networks
export const NETWORKS: NetworkInfo[] = [
  {
    id: 'testnet',
    name: 'LUKSO Testnet',
    chainId: TESTNET_CHAIN_ID,
    rpcHttp: 'https://rpc.testnet.lukso.gateway.fm',
    token: {
      symbol: 'LYXt',
      supply: toWei('42000000', 'ether'),
      name: 'LUKSO',
    },
    indexName: 'prod_testnet_universal_profiles',
    explorerUrl: 'https://explorer.execution.testnet.lukso.network',
    customLSP2ContractAddress: '0x27B3747A54E83Be1fD8835329585D0973E05149C', // '0x14603c30279a7278b90ce8E92bCB4336657B8f25',
  },
  {
    id: 'mainnet',
    name: 'LUKSO Mainnet',
    chainId: MAINNET_CHAIN_ID,
    rpcHttp: 'https://rpc.lukso.gateway.fm',
    token: {
      symbol: 'LYX',
      supply: toWei('42000000', 'ether'),
      name: 'LUKSO',
    },
    indexName: 'prod_mainnet_universal_profiles',
    explorerUrl: 'https://explorer.execution.mainnet.lukso.network',
    // customLSP2ContractAddress: '0x7ec7ac9cf675eef1de871d136bc4bb9e836b5ef4', // '0x1402141e81e6415da5d364994d8b277844c89739', //
    // customLSP2ContractAddress: '0x742fedb6ed0dd33544029a556db99ea5c5de4b7e', // '0x5578B353911a0D0B54E0faE838D4F259FF6Ce411', // '0xCA870F2Cb92A32628B9eBD3e9d8e4Bf420392273', // '0x87B343Ee4186f4d0af5183e3484156b948F03881',
    customLSP2ContractAddress: '0x5578B353911a0D0B54E0faE838D4F259FF6Ce411',
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

export const ASSET_ERROR_ICON_URL = '/images/image-error.svg'

// number of decimal places for LYX token
export const ASSET_LYX_DECIMALS = 18

// url of the ipfs gateway
export const IPFS_URL = 'https://api.universalprofile.cloud/ipfs/'

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

// search params
export const SEARCH_RESULTS_LIMIT = 100

// base universalprofile address
export const BASE_UP_CLOUD_URL = 'https://universalprofile.cloud'

// base wallet address
export const BASE_WALLET_URL = 'https://wallet.universalprofile.cloud'

// default currency symbol
export const DEFAULT_CURRENCY_SYMBOL = 'USD'

// list of currencies to fetch from the api
export const CURRENCY_API_SYMBOLS = ['USD', 'EUR', 'GBP', 'PLN']

// token to compare
export const CURRENCY_API_LYX_TOKEN_NAME = 'LYX'

// currency cache expiry time in minutes
export const CURRENCY_CACHE_EXPIRY_IN_MINUTES = 60

// Algolia API version
export const INDEXER_API_VERSION = 'v1'

// Algolia API url
export const INDEXER_API_URL = 'https://api.universalprofile.cloud'

// link to the testnet faucet
export const TESTNET_FAUCET_URL = 'https://faucet.testnet.lukso.network'

// transak api key, for staging tests you can use 'https://global-stg.transak.com'
export const TRANSAK_HOST = 'https://global.transak.com'
