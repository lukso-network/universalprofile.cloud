import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import { INTERFACE_IDS as INTERFACE_IDS_v12 } from '@lukso/lsp-smart-contracts-12'
import LSP0ERC725AccountInterface from '@lukso/lsp-smart-contracts/artifacts/LSP0ERC725Account.json'
import { hexToNumber, type AbiItem } from 'web3-utils'

import type { ContractType } from '@/types/contract'
import type { LSP0ERC725Account } from '@/types/contracts'

/**
 * Detect standard of given contract address
 * It performs one batch call to all possible interfaces
 *
 * @param contractAddress
 * @returns
 */
export const detectStandard = async (
  contractAddress: Address
): Promise<ContractType | undefined> => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  // initialize contract
  const eip165Contract = contract<LSP0ERC725Account>(
    LSP0ERC725AccountInterface.abi as AbiItem[],
    contractAddress
  )

  // list of interfaces that we want to check
  const interfacesToCheck = [
    INTERFACE_IDS.LSP0ERC725Account,
    INTERFACE_IDS.LSP7DigitalAsset,
    INTERFACE_IDS_v12.LSP7DigitalAsset,
    INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
    INTERFACE_IDS_v12.LSP8IdentifiableDigitalAsset,
  ]

  // prepare ABIs
  const abis = interfacesToCheck.map(interfaceId =>
    eip165Contract.methods.supportsInterface(interfaceId).encodeABI()
  )

  // batch calls
  const batchCall = await eip165Contract.methods.batchCalls(abis).call()

  const [
    lsp3interface,
    lsp7interface,
    lsp7v12interface,
    lsp8interface,
    lsp8v12interface,
  ] = batchCall.map(value => hexToNumber(value)) // since they some as hex we convert to number

  // since value can be 0 or 1 we just do if check
  if (lsp3interface) return 'LSP3Profile'
  if (lsp7interface) return 'LSP7DigitalAsset'
  if (lsp7v12interface) return 'LSP7DigitalAsset'
  if (lsp8interface) return 'LSP8IdentifiableDigitalAsset'
  if (lsp8v12interface) return 'LSP8IdentifiableDigitalAsset'
}
