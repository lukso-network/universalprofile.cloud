import { BrowserName } from './device'

export interface NetworkInfo {
  name: string
  rpcHttp: string
  chainId: string
  storeUrls?: { [key in BrowserName]: string }
  token: {
    symbol: string
    supply: number
    name: string
  }
  indexName: string
}
