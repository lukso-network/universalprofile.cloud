export const tokenRoute = (profileAddress: Address, tokenAddress: Address) =>
  `/profile/${profileAddress}/token/${tokenAddress}`

export const nftRoute = (profileAddress: Address, nftAddress: Address) =>
  `/profile/${profileAddress}/nft/${nftAddress}`

export const profileRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}`

export const sendRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}/send`

export const termsRoute = () => '/terms'
