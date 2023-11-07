import { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'
import ERC725, { ERC725JSONSchema } from '@erc725/erc725.js'
import LSP8IdentifiableDigitalAsset from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'

import { Lsp8TokenIdType } from '@/types/assets'

export const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<LSP4DigitalAssetMetadataJSON> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAsset as ERC725JSONSchema[]
  )

  try {
    const lsp8DigitalAsset = await erc725.fetchData('LSP8TokenIdType')
    const tokenIdType = Number(lsp8DigitalAsset.value)

    // fetch metadata depending on tokenIdType
    switch (tokenIdType) {
      case Lsp8TokenIdType.NUMBER:
        return await getMetadata(
          'uint256',
          parseInt(tokenId).toString(),
          erc725
        )
      case Lsp8TokenIdType.STRING:
        return await getMetadata('string', tokenId.toString(), erc725)
      case Lsp8TokenIdType.UNIQUE_ID:
      case Lsp8TokenIdType.HASH:
        return await getMetadata('bytes32', tokenId.toString(), erc725)
      case Lsp8TokenIdType.ADDRESS:
        return await getMetadata('address', tokenId.slice(0, 42), erc725)
      default:
        throw new Error(
          `Unsupported LSP8 tokenIdType '${tokenIdType}' for '${assetAddress}' asset`
        )
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

const getMetadata = async (
  tokenIdType: string,
  tokenIdValue: string,
  erc725: ERC725
) => {
  const lsp8Metadata = await erc725.fetchData([
    {
      keyName: `LSP8MetadataTokenURI:<${tokenIdType}>`,
      dynamicKeyParts: tokenIdValue,
    },
  ])
  return validateLsp4MetaData(lsp8Metadata[0].value)
}
