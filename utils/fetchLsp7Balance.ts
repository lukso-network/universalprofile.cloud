import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'

import { LSP7DigitalAsset as LSP7DigitalAssetInterface } from '@/types/contracts'

export const fetchLsp7Balance = async (
  assetAddress: Address,
  profileAddress: Address
) => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as any,
    assetAddress
  )

  return await lsp7Contract.methods.balanceOf(profileAddress).call()
}
