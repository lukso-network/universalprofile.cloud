export type Asset = {
  isNativeToken?: boolean
  isOwned: boolean
  isIssued: boolean
  address: Address
  assetData: any
  tokenStandard: string
  tokenIdFormat: number
  referenceContract: Address
  baseURI?: any
  tokenDataURL?: string
  tokenId?: `0x${string}`
  tokenIdIsContract?: boolean
  balance: string
  decimals: number
  standard: string
  name: string
  symbol: string
  tokenName: string
  tokenSymbol: string
  tokenType: string
  tokenURI?: string
  supportsInterfaces: Record<string, boolean>
  images: Image[][]
  icon: Image[]
  forTokenData: any
  forTokenImages: Image[][]
  forTokenIcon: Image[]
  baseURIImages: Image[][]
  baseURIIcon: Image[]
  lsp7Images: Image[][]
  lsp7Icon: Image[]
  owner: string
  creator: string
  tokenCreators: string[]
}
