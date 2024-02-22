import { SUPPORTED_NETWORK_IDS } from '@/shared/config'

import type { BrowserName } from './device'

export type NetworkId = (typeof SUPPORTED_NETWORK_IDS)[number]

export interface NetworkInfo {
  id: NetworkId
  name: string
  rpcHttp: string
  chainId: string
  storeUrls?: { [key in BrowserName]: string }
  token: {
    symbol: string
    supply: string
    name: string
  }
  indexName: string
  explorerUrl: string
  customLSP2ContractAddress: string
}
