import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'

import { PROVIDERS } from '@/types/enums'
import { Asset } from '@/types/assets'
import { LSP7DigitalAsset as LSP7DigitalAssetInterface } from '@/types/contracts'

export const fetchLsp7Assets = async (
  assetAddress: Address,
  profileAddress: Address
): Promise<Asset> => {
  const [name, symbol, metadata] = await fetchLsp4Metadata(assetAddress)

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as any,
    assetAddress
  )

  const tokenBalance = await lsp7Contract.methods
    .balanceOf(profileAddress)
    .call()
  const tokenSupply = await lsp7Contract.methods.totalSupply().call()
  const decimals = await lsp7Contract.methods.decimals().call()

  return {
    address: assetAddress,
    name,
    symbol,
    amount: tokenBalance.toString(),
    decimals,
    tokenSupply,
    icon: metadata.LSP4Metadata.icon[2]?.url
      ? metadata.LSP4Metadata.icon[2]?.url
      : ASSET_ICON_PLACEHOLDER_URL, // TODO fetch optimal size, check existence, fallback to default
    links: metadata.LSP4Metadata.links,
    description: metadata.LSP4Metadata.description,
    images: metadata.LSP4Metadata.images.map(image => image[2]), // TODO fetch optimal size, check for existence etc
    metadata: metadata.LSP4Metadata,
    standard: 'LSP7DigitalAsset',
  }
}
