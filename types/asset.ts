import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

export type Asset = {
  isOwned: boolean
  isIssued: boolean
  address: Address
  assetData: any
  tokenStandard: string
  tokenIdFormat: number
  referenceContract: Address
  balance: string
  decimals: number
  standard: string
  name: string
  symbol: string
  tokenName: string
  tokenSymbol: string
  tokenType: number
  supportsInterfaces: Record<string, boolean>
  isNativeToken?: boolean
  baseURI?: any
  tokenDataURL?: string
  tokenId?: `0x${string}`
  tokenIdIsContract?: boolean
  tokenURI?: string
  forTokenData?: any
  images?: Image[][]
  icon?: Image[]
  forTokenImages?: Image[][]
  forTokenIcon?: Image[]
  baseURIImages?: Image[][]
  baseURIIcon?: Image[]
  lsp7Images?: Image[][]
  lsp7Icon?: Image[]
  owner?: Address
  creator?: Address
  tokenCreators?: Address[]
  description?: string
  assets?: AssetMetadata[]
  attributes: AttributeMetadata[]
  links?: LinkMetadata[]
  tokenSupply?: string
}
