import up from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'

import type { AbiItem } from 'web3-utils'

export const getDataABI: AbiItem[] = (up.abi as AbiItem[]).filter(
  ({ name }) => name === 'getData'
)
