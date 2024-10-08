import { SUPPORTED_NETWORK_IDS } from '@/shared/config'

import type { HttpHeader } from 'web3-core-helpers'
import type { BrowserName } from './device'

export type NetworkId = (typeof SUPPORTED_NETWORK_IDS)[number]

export type RpcNode = {
  host: string
  headers?: HttpHeader[]
}

export interface NetworkInfo {
  id: NetworkId
  name: string
  rpcNodes: RpcNode[]
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
  followingSystemContractAddress: string
}
