import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'

import type { ERC725JSONSchema } from '@erc725/erc725.js'
import type { LSP4DigitalAssetMetadataJSON } from '@lukso/lsp-smart-contracts'
import type { URLDataWithHash } from '@erc725/erc725.js/build/main/src/types'

export const fetchLsp4Metadata = async (
  assetAddress: Address
): Promise<[string, string, LSP4DigitalAssetMetadataJSON]> => {
  const { getInstance } = useErc725()

  const erc725 = getInstance(
    assetAddress,
    LSP4DigitalAsset as ERC725JSONSchema[]
  )

  try {
    const lsp4DigitalAsset = await erc725.getData([
      'LSP4TokenName',
      'LSP4TokenSymbol',
      'LSP4Metadata',
    ])

    const name =
      typeof lsp4DigitalAsset[0]?.value === 'string'
        ? lsp4DigitalAsset[0]?.value
        : ''
    const symbol =
      typeof lsp4DigitalAsset[1]?.value == 'string'
        ? lsp4DigitalAsset[1]?.value
        : ''
    const metadata = validateLsp4MetaData(
      lsp4DigitalAsset[2].value as URLDataWithHash
    )
    return [name, symbol, metadata]
  } catch (error) {
    console.error(error)
    return [
      '',
      '',
      {
        LSP4Metadata: {
          description: '',
          links: [],
          images: [[]],
          icon: [],
          assets: [],
        },
      },
    ]
  }
}

export const fetchLsp4Data = async (assetAddress: string) => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    assetAddress,
    LSP4DigitalAsset as ERC725JSONSchema[]
  )
  const metaData = await erc725.getData('LSP4Metadata')

  return metaData
}
