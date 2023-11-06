export const fetchAsset = async (
  address: Address,
  profileAddress?: Address,
  tokenIds?: string[]
) => {
  const standard = await detectStandard(address)

  switch (standard) {
    case 'LSP8IdentifiableDigitalAsset': {
      return await fetchLsp8Assets(address, profileAddress, tokenIds)
    }
    case 'LSP7DigitalAsset': {
      return [await fetchLsp7Assets(address, profileAddress)]
    }

    default:
      console.warn(`Asset ${address} standard is not supported`)
      return []
  }
}
