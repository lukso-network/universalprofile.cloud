import { ERC725, ERC725JSONSchema } from '@erc725/erc725.js'
import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { LSP3Profile } from '@lukso/lsp-factory.js'
import Web3 from 'web3'
import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'

import { Lsp8TokenIdType } from '@/types/assets'
import LSP8IdentifiableDigitalAsset from '@/shared/schemas/LSP8IdentifiableDigitalAsset.json'

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

const fetchAssets = async (profileAddress: Address, schema: string) => {
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const result = await erc725.fetchData(schema)
  const assetAddresses = result.value as Address[]

  const assets = await Promise.all(
    assetAddresses.map(async address => {
      const standard = await detectStandard(address)
      const { viewedProfile } = useViewedProfile()
      assertAddress(viewedProfile.value?.address)

      switch (standard) {
        case 'LSP8IdentifiableDigitalAsset': {
          return await fetchLsp8Assets(address, viewedProfile.value.address)
        }
        case 'LSP7DigitalAsset': {
          return await fetchLsp7Assets(address, viewedProfile.value.address)
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

const useErc725 = () => {
  return {
    getInstance,
    fetchAssets,
    fetchLsp8Metadata,
  }
}

export default useErc725
