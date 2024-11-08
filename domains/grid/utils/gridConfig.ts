import ERC725, { type ERC725JSONSchema } from '@erc725/erc725.js'
import UniversalProfileContract from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'

import { AuthenticatedFormDataUploader } from '@/services/ipfs/authenticated-formdata-client'
import { BaseFormDataUploader } from '@/services/ipfs/formdata-base-client'
import LSP28TheGrid from '@/shared/schemas/LSP28TheGrid.json'

import type { UniversalProfile } from '@/contracts/UniversalProfile'
import type { DecodeDataOutput } from '@erc725/erc725.js/build/main/src/types/decodeData'
import type { AbiItem } from 'web3-utils'

let uploadProvider: BaseFormDataUploader | undefined
const dataKey = ERC725.encodeKeyName('LSP28TheGrid')

/**
 * Get the IPFS upload provider
 *
 * @returns
 */
const getUploadProvider = () => {
  if (!uploadProvider) {
    uploadProvider = new AuthenticatedFormDataUploader(IPFS_CLIENT_URL, {})
  }
  return uploadProvider
}

/**
 * Get the grid config for a given address
 *
 * @param address
 * @returns
 */
export const getGridConfig = async (address: Address) => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const universalProfileContract = contract<UniversalProfile>(
    UniversalProfileContract.abi as AbiItem[],
    address
  )

  // read encoded config url to UP
  const getDataValue = await universalProfileContract?.methods
    .getData(dataKey)
    .call()

  if (!getDataValue) {
    return []
  }

  // decode config
  const decodedData = ERC725.decodeData(
    [
      {
        value: getDataValue,
        keyName: 'LSP28TheGrid',
      },
    ],
    LSP28TheGrid as ERC725JSONSchema[]
  )
  const [decodedJsonUrl] = decodedData as DecodeDataOutput[]
  const { url } = decodedJsonUrl.value as VerifiableURI

  if (gridLog.enabled) {
    gridLog('Grid config URL', resolveUrl(url))
  }

  // fetch config file from IPFS
  const config = await fetcher<GridConfig[], Record<string, never>>({
    url: resolveUrl(url),
    method: 'GET',
  })

  if (gridLog.enabled) {
    gridLog('Grid config from IPFS', config)
  }

  return config || []
}

/**
 * Save the grid config for a given address
 *
 * @param address
 * @param config
 * @param saveCallback
 */
export const saveConfig = async (address: Address, config: GridConfig[]) => {
  // convert config to blob
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json',
  })

  // upload blob to IPFS
  const uploadProvider = getUploadProvider()
  const url = await uploadProvider.upload(blob)

  if (gridLog.enabled) {
    gridLog('Config IPFS url', resolveUrl(url))
  }

  // encode uploaded config url
  const encodedData = ERC725.encodeData(
    [
      {
        value: {
          json: config,
          url,
        },
        keyName: 'LSP28TheGrid',
      },
    ],
    LSP28TheGrid as ERC725JSONSchema[]
  )
  const [encodedJsonUrl] = encodedData.values

  if (gridLog.enabled) {
    gridLog('Config encoded JSON url', encodedJsonUrl)
  }

  const { providerWeb3Instance } = useBaseProvider()
  const { contract } = providerWeb3Instance.value
  const universalProfileContract = contract<UniversalProfile>(
    UniversalProfileContract.abi as AbiItem[],
    address
  )

  // save encoded config url to UP
  return universalProfileContract?.methods.setData(dataKey, encodedJsonUrl)
}
