import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import { INTERFACE_IDS as INTERFACE_IDS_v12 } from '@lukso/lsp-smart-contracts-12'

import type { InterfaceId } from '@/types/assets'

export const detectStandard = async (
  contractAddress: Address
): Promise<InterfaceId | undefined> => {
  // LSP0
  if (
    await supportInterface(contractAddress, INTERFACE_IDS.LSP0ERC725Account)
  ) {
    return 'LSP0ERC725Account'
  }

  // LSP7 (we check old and new interface)
  if (
    (await supportInterface(contractAddress, INTERFACE_IDS.LSP7DigitalAsset)) ||
    (await supportInterface(
      contractAddress,
      INTERFACE_IDS_v12.LSP7DigitalAsset
    ))
  ) {
    return 'LSP7DigitalAsset'
  }

  // LSP8 (we check old and new interface)
  if (
    (await supportInterface(
      contractAddress,
      INTERFACE_IDS.LSP8IdentifiableDigitalAsset
    )) ||
    (await supportInterface(
      contractAddress,
      INTERFACE_IDS_v12.LSP8IdentifiableDigitalAsset
    ))
  ) {
    return 'LSP8IdentifiableDigitalAsset'
  }

  // LSP9
  if (await supportInterface(contractAddress, INTERFACE_IDS.LSP9Vault)) {
    return 'LSP9Vault'
  }

  // TODO: add legacy standard detection (ERC20, ERC721, ERC1155...)
}
