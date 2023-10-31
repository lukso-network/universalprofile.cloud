import { Asset } from '@/models/asset'

export const fetchAsset = async (
  address: Address,
  profileAddress?: Address,
  tokenIds?: string[]
): Promise<Asset[]> => {
  const standard = await detectStandard(address)

  switch (standard) {
    case 'LSP8IdentifiableDigitalAsset': {
      return await fetchLsp8Assets(address, profileAddress, tokenIds)
    }
    case 'LSP7DigitalAsset': {
      return [await fetchLsp7Assets(address, profileAddress)]
    }

    default:
      return []
  }
}
