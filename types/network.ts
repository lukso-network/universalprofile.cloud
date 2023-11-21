import { BrowserName } from './device'

export type NetworkId = 'mainnet' | 'testnet'

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
}
