import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'

import { PROVIDERS } from '@/types/enums'
import { LSP7Asset } from '@/types/assets'

const fetchLSP7Assets = async (
  assetAddress: Address,
  profileAddress: Address
): Promise<LSP7Asset | undefined> => {
  const { fetchLSP4Metadata } = useErc725()
  const lsp4Metadata = await fetchLSP4Metadata(assetAddress)

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract(LSP7DigitalAsset.abi as any, assetAddress)

  const tokenBalance = await lsp7Contract.methods
    .balanceOf(profileAddress)
    .call()
  const tokenSupply = await lsp7Contract.methods.totalSupply().call()
  const decimals = await lsp7Contract.methods.decimals().call()

  const lsp7Object = createLSP7Object(
    lsp4Metadata,
    tokenBalance,
    assetAddress,
    tokenSupply,
    decimals
  )
  return lsp7Object
}

const createLSP7Object = (
  lsp4DigitalAssetJSON: [string, string, LSP4DigitalAssetJSON],
  tokenBalance: number,
  assetAddress: Address,
  tokenSupply: string,
  decimals: string
): LSP7Asset => {
  const [name, symbol, lsp4MetadataJSON] = lsp4DigitalAssetJSON
  const lsp7AssetObject = {
    name,
    symbol,
    amount: tokenBalance.toString(),
    icon: lsp4MetadataJSON.LSP4Metadata.icon[0]?.url
      ? lsp4MetadataJSON.LSP4Metadata.icon[0]?.url
      : ASSET_ICON_PLACEHOLDER_URL,
    address: assetAddress,
    links: lsp4MetadataJSON.LSP4Metadata.links,
    description: lsp4MetadataJSON.LSP4Metadata.description,
    images: lsp4MetadataJSON.LSP4Metadata.images,
    tokenSupply,
    decimals,
  }
  return lsp7AssetObject
}

export default fetchLSP7Assets
