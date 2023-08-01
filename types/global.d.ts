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
}

export {}
