import { BrowserName } from './device'

export type NetworkId = string
export type ChainIdHex = `0x${string}`

export interface NetworkInfo {
  id: NetworkId
  name: string
  rpcHttp: string
  chainId: ChainIdHex
  storeUrls?: { [key in BrowserName]: string }
  token: {
    symbol: string
    supply: number
    name: string
  }
}
