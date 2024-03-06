import LSP8IdentifiableDigitalAssetSchema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import {
  ERC725YDataKeys,
  LSP8_TOKEN_ID_FORMAT,
} from '@lukso/lsp-smart-contracts'
import ERC725 from '@erc725/erc725.js'
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'

import type { AbiItem } from 'web3-utils'
import type { ERC725JSONSchema } from '@erc725/erc725.js'
import type { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'
import type { URLDataWithHash } from '@erc725/erc725.js/build/main/src/types'
import type { LSP8IdentifiableDigitalAsset } from '@/contracts'

export const fetchLsp8Metadata = async (
  tokenId: string,
  assetAddress: Address
): Promise<[LSP4DigitalAssetMetadataJSON, number]> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP8IdentifiableDigitalAssetSchema as ERC725JSONSchema[]
  )
  const supportedTokenIdFormats = Object.values(LSP8_TOKEN_ID_FORMAT)

  try {
    const lsp8DigitalAsset = await erc725.fetchData('LSP8TokenIdFormat')
    const tokenIdFormat = Number(lsp8DigitalAsset.value)

    if (supportedTokenIdFormats.includes(tokenIdFormat)) {
      return [
        await getLsp8Metadata(assetAddress, tokenId, tokenIdFormat),
        tokenIdFormat,
      ]
    } else {
      throw new Error(
        `Unsupported LSP8 tokenIdFormat '${tokenIdFormat}' for '${assetAddress}' asset`
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
 * Get LSP4 metadata from token contract based on tokenId
 *
 * @param assetAddress - token address
 * @param tokenId - token identifier
 * @returns
 */
const getLsp4Metadata = async (assetAddress: string, tokenId: string) => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp8Contract = contract<LSP8IdentifiableDigitalAsset>(
    LSP8IdentifiableDigitalAssetContract.abi as AbiItem[],
    assetAddress
  )
  const metadata = await lsp8Contract.methods
    .getDataForTokenId(tokenId, ERC725YDataKeys.LSP4.LSP4Metadata)
    .call()

  return metadata
}

/**
 * Get LSP8 metadata  as json object
 * It first try to check asset LSP4Metadata key and when it's empty we fall back to LSP8TokenMetadataBaseURI key
 *
 * @param assetAddress - token address
 * @param tokenId - token id
 * @returns
 */
const getLsp8Metadata = async (
  assetAddress: string,
  tokenId: string,
  tokenIdFormat: number
) => {
  let getData: URLDataWithHash
  let url: string

  const lsp4metadataForTokenId = await getLsp4Metadata(assetAddress, tokenId)

  if (lsp4metadataForTokenId) {
    const decode = ERC725.decodeData(
      [
        {
          value: lsp4metadataForTokenId,
          keyName: ERC725YDataKeys.LSP4.LSP4Metadata,
        },
      ],
      LSP4DigitalAsset as ERC725JSONSchema[]
    )
    getData = decode[0].value as URLDataWithHash
    url = resolveUrl(getData.url)
  } else {
    const { url: uri } = (await getLsp8TokenMetadataBaseUri(assetAddress)) || {}

    if (!uri) {
      throw new Error('LSP8TokenMetadataBaseURI is empty')
    }
    getData = await getLsp8TokenMetadataBaseUri(assetAddress)

    // TODO add support for mixed formats

    // in order to get full url we combine URI it with tokenId (must be lowercased)
    // we also resolve url as uri might be ipfs link
    url = resolveUrl(uri + parseTokenId(tokenId, tokenIdFormat))
  }

  // fetch json file
  const metadata = await fetch(resolveUrl(url)).then(async response => {
    if (!response.ok) {
      let text: any = (await response.text()) || response.statusText
      if (text) {
        try {
          text = JSON.parse(text)
          text = text.message || text.error || text
        } catch {
          // Ignore
        }
        throw new Error(text)
      }
    }
    return response.json().catch(error => {
      console.error(url, error, response.status, response.statusText)
      throw new Error('Unable to parse json')
    })
  })

  return validateLsp4Metadata(metadata)
}
