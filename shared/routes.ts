export const tokenRoute = (profileAddress: Address, tokenAddress: Address) =>
  `/profile/${profileAddress}/token/${tokenAddress}`

export const nftRoute = (
  profileAddress: Address,
  nftAddress: Address,
  tokenId: string
) => `/profile/${profileAddress}/nft/${nftAddress}/tokenId/${tokenId}`

export const profileRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}`

export const sendRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}/send`

export const homeRoute = () => '/'

export const notFoundRoute = () => '/404'
