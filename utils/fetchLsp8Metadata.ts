import ERC725, { type ERC725JSONSchema } from '@erc725/erc725.js'
import LSP8IdentifiableDigitalAsset from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'

import { Lsp8TokenIdType } from '@/types/assets'

import type { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'

export const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<[LSP4DigitalAssetMetadataJSON, number]> => {
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
        return [
          await getMetadata(tokenIdType, parseInt(tokenId).toString(), erc725),
          tokenIdType,
        ]
      case Lsp8TokenIdType.STRING:
      case Lsp8TokenIdType.UNIQUE_ID:
      case Lsp8TokenIdType.HASH:
        return [
          await getMetadata(tokenIdType, tokenId.toString(), erc725),
          tokenIdType,
        ]
      case Lsp8TokenIdType.ADDRESS:
        return [
          await getMetadata(tokenIdType, tokenId.slice(0, 42), erc725),
          tokenIdType,
        ]
      default:
        throw new Error(
          `Unsupported LSP8 tokenIdType '${tokenIdType}' for '${assetAddress}' asset`
        )
    }
  } catch (error) {
    console.error(error)
    return [
      {
        LSP4Metadata: {
          description: '',
          links: [],
          images: [[]],
          icon: [],
          assets: [],
        },
      },
      -1,
    ]
  }
}

const tokenIdTypeString = (tokenIdType: number) => {
  switch (tokenIdType) {
    case Lsp8TokenIdType.NUMBER:
      return 'uint256'
    case Lsp8TokenIdType.STRING:
      return 'string'
    case Lsp8TokenIdType.UNIQUE_ID:
      return 'bytes32'
    case Lsp8TokenIdType.HASH:
      return 'bytes32'
    case Lsp8TokenIdType.ADDRESS:
      return 'address'
    default:
      throw new Error(`Unsupported LSP8 tokenIdType '${tokenIdType}'`)
  }
}

export const getLsp8Data = async (
  assetAddress: string,
  tokenIdType?: number,
  tokenId?: string
) => {
  if (!tokenIdType || !tokenId) {
    return
  }

  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAsset as ERC725JSONSchema[]
  )
  const metaData = await erc725.getData({
    keyName: `LSP8MetadataTokenURI:<${tokenIdTypeString(tokenIdType)}>`,
    dynamicKeyParts: tokenId,
  })

  return metaData
}

const getMetadata = async (
  tokenIdType: number,
  tokenIdValue: string,
  erc725: ERC725
) => {
  const lsp8Metadata = await erc725.fetchData([
    {
      keyName: `LSP8MetadataTokenURI:<${tokenIdTypeString(tokenIdType)}>`,
      dynamicKeyParts: tokenIdValue,
    },
  ])
  return validateLsp4MetaData(lsp8Metadata[0].value)
}
