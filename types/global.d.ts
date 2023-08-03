import { LSP3Profile } from '@lukso/lsp-factory.js'

declare global {
  type Address = `0x${string}`

  interface Lsp7AssetType {
    name: string
    symbol: string
    amount: string
    icon: string
    address: string
  }

  interface Lsp8AssetType {
    image: string
    icon: string
    tokenId: string
    description: string
    collectionName: string
    collectionDescription: string
    collectionImage: string
    collectionIcon: string
    collectionAddress: string
  }

  type Profile = LSP3Profile & {
    backgroundImageUrl?: string
    profileImageUrl?: string
    address?: Address
  }

  type NetworkId = string
  type ChainIdHex = `0x${string}`

  interface NetworkInfo {
    id: NetworkId
    name: string
    rpcHttp: string
    chainId: ChainIdHex
    ipfsUrl: string
  }

  interface Window {
    ethereum: any
  }
}

export {}
