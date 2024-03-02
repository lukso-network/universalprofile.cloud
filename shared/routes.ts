export const tokenRoute = (tokenAddress: Address) => `/asset/${tokenAddress}`

export const nftRoute = (nftAddress: Address, tokenId: string) =>
  `/asset/${nftAddress}/tokenId/${tokenId}`

export const gotoContract = (address: Address) => `/contract/${address}`

export const profileRoute = (profileAddress: Address) => `/${profileAddress}`

export const sendRoute = (profileAddress: Address) => `/${profileAddress}/send`

export const homeRoute = () => '/'

export const notFoundRoute = () => '/404'

export const lyxDetailsRoute = (profileAddress: Address) =>
  `/${profileAddress}/lyx-details`

export const buyLyxRoute = (profileAddress: Address) =>
  `/${profileAddress}/buy-lyx`
