import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js'
import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { LSP3Profile } from '@lukso/lsp-factory.js'
import Web3 from 'web3'
import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts'

import { LSP0ERC725Account } from '@/types/contracts/LSP0ERC725Account'
import { Lsp8TokenIdType } from '@/types/assets'
import { getImageUrlBySize } from '@/utils/getProfileImages'
import LSP8IdentifiableDigitalAsset from '@/shared/schemas/LSP8IdentifiableDigitalAsset.json'
import { PROVIDERS } from '@/types/enums'

export interface LSP3ProfileJSON {
  LSP3Profile: LSP3Profile
}

const getInstance = (address: string, schema: ERC725JSONSchema[]) => {
  const { currentNetwork } = useAppStore()
  const config = {
    ipfsGateway: IPFS_URL,
  }
  const provider = new Web3.providers.HttpProvider(currentNetwork.rpcHttp)
  const erc725 = new ERC725(schema, address, provider, config)

  return erc725
}

const fetchProfile = async (profileAddress: Address): Promise<Profile> => {
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const fetchedProfile = await erc725.fetchData('LSP3Profile')
  const lsp3Profile = validateLSP3(fetchedProfile)

  // we get only optimal profile images that will be later used in UI
  const optimalProfileImage = lsp3Profile.profileImage
    ? getImageUrlBySize(lsp3Profile.profileImage, 200, 200)
    : ''
  const optimalBackgroundImage = lsp3Profile.backgroundImage
    ? getImageUrlBySize(lsp3Profile.backgroundImage, 800, 400)
    : ''

  const { getBalance } = useWeb3(PROVIDERS.RPC)
  const balance = await getBalance(profileAddress)

  return {
    ...lsp3Profile,
    address: profileAddress,
    profileImageUrl: optimalProfileImage || '',
    backgroundImageUrl: optimalBackgroundImage || '',
    balance,
  }
}

const fetchAssets = async (profileAddress: Address, schema: string) => {
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const result = await erc725.fetchData(schema)
  const assetAddresses = result.value as Address[]
  const { profile } = useViewedProfileStore()

  const assets = await Promise.all(
    assetAddresses.map(async address => {
      const standard = await detectStandard(address)

      switch (standard) {
        case 'LSP8IdentifiableDigitalAsset': {
          assertAddress(profile.address)
          return await fetchLsp8Assets(address, profile.address)
        }
        case 'LSP7DigitalAsset': {
          assertAddress(profile.address)
          return await fetchLsp7Assets(address, profile.address)
        }

        default:
          return []
      }
    })
  )

  return assets.flat()
}

const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<LSP4DigitalAssetJSON> => {
  const lsp8MetadataGetter = async (
    tokenIdType: string,
    tokenId: string
  ): Promise<LSP4DigitalAssetJSON> => {
    const lsp8Metadata = await erc725.fetchData([
      {
        keyName: `LSP8MetadataJSON:<${tokenIdType}>`,
        dynamicKeyParts: tokenId,
      },
    ])
    return validateLSP4MetaData(lsp8Metadata[0].value)
  }

  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAsset as ERC725JSONSchema[]
  )

  try {
    const lsp8DigitalAsset = await erc725.fetchData(['LSP8TokenIdType'])
    const tokenIdType = lsp8DigitalAsset[0].value.toString()

    // fetch LSP8MetadataJSON depending on tokenIdType
    switch (tokenIdType) {
      case Lsp8TokenIdType.address:
        return lsp8MetadataGetter(
          'address',
          // ethers.utils.hexDataSlice(tokenId.toString(), 12)
          tokenId.toString()
        )
      case Lsp8TokenIdType.number:
        return lsp8MetadataGetter('uint256', parseInt(tokenId).toString())
      case Lsp8TokenIdType.bytes32:
        return lsp8MetadataGetter('bytes32', tokenId.toString())
      default:
        return {
          LSP4Metadata: {
            description: '',
            links: [],
            images: [[]],
            icon: [],
            assets: [],
          },
        }
    }
  } catch (error) {
    console.error(error)
    return {
      LSP4Metadata: {
        description: '',
        links: [],
        images: [[]],
        icon: [],
        assets: [],
      },
    }
  }
}

const fetchLSP4Creator = async (
  assetAddress: Address
): Promise<Creator | undefined> => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  try {
    const creator = await contract<LSP0ERC725Account>(getDataABI, assetAddress)
      .methods.getData(ERC725YDataKeys.LSP4['LSP4Creators[]'].index)
      .call()
    assertAddress(creator)
    const erc725 = getInstance(
      creator,
      LSP3ProfileMetadata as ERC725JSONSchema[]
    )
    const fetchedProfile = await erc725.fetchData('LSP3Profile')
    const lsp3Profile = validateLSP3(fetchedProfile)

    // we get only optimal profile images that will be later used in UI
    const optimalProfileImage = lsp3Profile.profileImage
      ? getImageUrlBySize(lsp3Profile.profileImage, 200, 200)
      : ''
    return {
      address: creator,
      name: lsp3Profile.name,
      profileImageUrl: optimalProfileImage,
    }
  } catch (error) {
    console.error(error)
  }
}

const useErc725 = () => {
  return {
    getInstance,
    fetchProfile,
    fetchAssets,
    fetchLsp8Metadata,
    fetchLSP4Creator,
  }
}

export default useErc725
