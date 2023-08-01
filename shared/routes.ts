export const tokenRoute = (profileAddress: Address, tokenAddress: Address) =>
  `/profile/${profileAddress}/token/${tokenAddress}`

export const collectibleRoute = (
  profileAddress: Address,
  tokenAddress: Address
) => `/profile/${profileAddress}/collectible/${tokenAddress}`

export const profileRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}`

export const sendRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}/send`

export const termsRoute = () => '/terms'
