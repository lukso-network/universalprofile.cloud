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
    const tokenIdType = Number(lsp8DigitalAsset[0].value)

    // fetch LSP8MetadataJSON depending on tokenIdType
    switch (tokenIdType) {
      case Lsp8TokenIdType.NUMBER:
        return await lsp8MetadataGetter('uint256', parseInt(tokenId).toString())
      case Lsp8TokenIdType.STRING:
        return await lsp8MetadataGetter('string', tokenId.toString())
      case Lsp8TokenIdType.UNIQUE_ID:
      case Lsp8TokenIdType.HASH:
        return await lsp8MetadataGetter('bytes32', tokenId.toString())
      case Lsp8TokenIdType.ADDRESS:
        return await lsp8MetadataGetter('address', tokenId.slice(0, 42))
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
