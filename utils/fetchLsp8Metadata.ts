import { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'
import { ERC725JSONSchema } from '@erc725/erc725.js'

import { Lsp8TokenIdType } from '@/types/assets'
import LSP8IdentifiableDigitalAsset from '@/shared/schemas/LSP8IdentifiableDigitalAsset.json'

export const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<LSP4DigitalAssetMetadataJSON> => {
  const lsp8MetadataGetter = async (
    tokenIdType: string,
    tokenId: string
  ): Promise<LSP4DigitalAssetMetadataJSON> => {
    const lsp8Metadata = await erc725.fetchData([
      {
        keyName: `LSP8MetadataJSON:<${tokenIdType}>`,
        dynamicKeyParts: tokenId,
      },
    ])
    return validateLsp4MetaData(lsp8Metadata[0].value)
  }

  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAsset as ERC725JSONSchema[]
  )

  try {
    const lsp8DigitalAsset = await erc725.fetchData(['LSP8TokenIdType'])
    const tokenIdType = lsp8DigitalAsset[0].value?.toString()

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
