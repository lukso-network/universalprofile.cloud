export const tokenRoute = (profileAddress: Address, assetAddress: Address) =>
  `/profile/${profileAddress}/token/${assetAddress}`

export const collectibleRoute = (
  profileAddress: Address,
  assetAddress: Address
) => `/profile/${profileAddress}/collectible/${assetAddress}`

export const profileRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}`

export const sendRoute = (profileAddress: Address) =>
  `/profile/${profileAddress}/send`

export const termsRoute = () => '/terms'
