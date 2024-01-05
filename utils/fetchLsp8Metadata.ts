import LSP8IdentifiableDigitalAssetSchema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import { hexToUtf8 } from 'web3-utils'

import { Lsp8TokenIdType } from '@/types/assets'

import type { ERC725JSONSchema } from '@erc725/erc725.js'
import type { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'
import type { URLDataWithHash } from '@erc725/erc725.js/build/main/src/types'

export const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<[LSP4DigitalAssetMetadataJSON, number]> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAssetSchema as ERC725JSONSchema[]
  )

  try {
    const lsp8DigitalAsset = await erc725.fetchData('LSP8TokenIdFormat')
    const tokenIdType = Number(lsp8DigitalAsset.value)

    // fetch metadata depending on tokenIdType
    switch (tokenIdType) {
      case Lsp8TokenIdType.NUMBER:
        return [await getLsp8Metadata(assetAddress, tokenId), tokenIdType]
      case Lsp8TokenIdType.STRING:
        return [
          await getLsp8Metadata(assetAddress, hexToUtf8(tokenId)),
          tokenIdType,
        ]
      case Lsp8TokenIdType.UNIQUE_ID:
      case Lsp8TokenIdType.HASH:
        return [await getLsp8Metadata(assetAddress, tokenId), tokenIdType]
      case Lsp8TokenIdType.ADDRESS:
        return [await getLsp8Metadata(assetAddress, tokenId), tokenIdType]
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

/**
 * Get the base URI of LSP8 token
 * https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md#lsp8tokenmetadatabaseuri
 *
 * @param assetAddress - token address
 * @returns
 */
export const getLsp8TokenMetadataBaseUri = async (assetAddress: string) => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAssetSchema as ERC725JSONSchema[]
  )
  const getData = (await erc725.getData('LSP8TokenMetadataBaseURI'))
    .value as URLDataWithHash

  return getData
}

/**
 * Get LSP8 metadata  as json object
 *
 * @param assetAddress - token address
 * @param tokenId - token id
 * @returns
 */
const getLsp8Metadata = async (assetAddress: string, tokenId: string) => {
  // TODO first get LSP4 metadata and use LSP8 URI as fallback

  // const { contract } = useWeb3(PROVIDERS.RPC)
  // const lsp8Contract = contract<LSP8IdentifiableDigitalAsset>(
  //   LSP8IdentifiableDigitalAssetContract.abi as AbiItem[],
  //   assetAddress
  // )

  // const lsp4metadata = await lsp8Contract.methods
  //   .getDataForTokenId(
  //     tokenId,
  //     '0x9afb95cacc9f95858ec44aa8c3b685511002e30ae54415823f406128b85b238e'
  //   )
  //   .call()
  // console.log('lsp4metadata', lsp4metadata)

  // if (lsp4metadata) {
  //   return validateLsp4MetaData(lsp4metadata)
  // }

  const getData = await getLsp8TokenMetadataBaseUri(assetAddress)

  const uri =
    !getData.verification.method || getData.verification.method === 'unknown'
      ? getData?.url
      : hexToUtf8(getData?.verification.data) + getData?.url

  // in order to get full url we combine URI it with tokenId
  const url = uri + tokenId

  // fetch json file
  const lsp8Metadata = await fetch(url).then(response => response.json())

  console.log('lsp8Metadata', lsp8Metadata.LSP4Metadata)

  return validateLsp4MetaData(lsp8Metadata)
}
