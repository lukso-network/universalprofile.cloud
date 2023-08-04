import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js'
import LSP3UniversalProfileMetadata from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json'
import { LSP3Profile } from '@lukso/lsp-factory.js'
import Web3 from 'web3'

import { getImageUrlBySize } from '@/utils/getProfileImages'

export interface LSP3ProfileJSON {
  LSP3Profile: LSP3Profile
}

const getInstance = (address: string) => {
  const network = useAppStore().getNetwork(useAppStore().selectedNetwork)
  const provider = new Web3.providers.HttpProvider(network.rpcHttp)
  const config = {
    ipfsGateway: network.ipfsUrl,
  }

  const erc725 = new ERC725(
    LSP3UniversalProfileMetadata as ERC725JSONSchema[],
    address,
    provider,
    config
  )

  return erc725
}

const fetchProfile = async (profileAddress: Address): Promise<Profile> => {
  const erc725 = getInstance(profileAddress)
  const fetchedProfile = await erc725.fetchData('LSP3Profile')
  const lsp3Profile = validateLSP3(fetchedProfile)

  // we get only optimal profile images that will be later used in UI
  const optimalProfileImage = lsp3Profile.profileImage
    ? getImageUrlBySize(lsp3Profile.profileImage, 200, 200)
    : ''
  const optimalBackgroundImage = lsp3Profile.backgroundImage
    ? getImageUrlBySize(lsp3Profile.backgroundImage, 800, 400)
    : ''

  return {
    ...lsp3Profile,
    address: profileAddress,
    profileImageUrl: optimalProfileImage || '',
    backgroundImageUrl: optimalBackgroundImage || '',
  }
}

const useErc725 = () => {
  return {
    fetchProfile,
  }
}

export default useErc725
