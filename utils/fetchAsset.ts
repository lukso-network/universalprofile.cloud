import { Asset } from '@/models/asset'

export const fetchAsset = async (address: Address): Promise<Asset[]> => {
  const standard = await detectStandard(address)

  const { viewedProfile } = useViewedProfile()
  assertAddress(viewedProfile.value?.address)

  switch (standard) {
    case 'LSP8IdentifiableDigitalAsset': {
      return await fetchLsp8Assets(address, viewedProfile.value.address)
    }
    case 'LSP7DigitalAsset': {
      return [await fetchLsp7Assets(address, viewedProfile.value.address)]
    }

    default:
      return []
  }
}
