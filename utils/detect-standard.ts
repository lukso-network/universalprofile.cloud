import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'

import { InterfaceId } from '@/types/assets'

export const detectStandard = async (
  contractAddress: Address
): Promise<InterfaceId | undefined> => {
  // LSP0
  if (await checkInterface(contractAddress, INTERFACE_IDS.LSP0ERC725Account)) {
    return 'LSP0ERC725Account'
  }

  // LSP7
  if (await checkInterface(contractAddress, INTERFACE_IDS.LSP7DigitalAsset)) {
    return 'LSP7DigitalAsset'
  }

  // LSP8
  if (
    await checkInterface(
      contractAddress,
      INTERFACE_IDS.LSP8IdentifiableDigitalAsset
    )
  ) {
    return 'LSP8IdentifiableDigitalAsset'
  }

  // LSP9
  if (await checkInterface(contractAddress, INTERFACE_IDS.LSP9Vault)) {
    return 'LSP9Vault'
  }

  // TODO: add legacy standard detection (ERC20, ERC721, ERC1155...)
}
