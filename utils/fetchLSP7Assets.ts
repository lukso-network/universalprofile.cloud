import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'

import { PROVIDERS } from '@/types/enums'
import { Asset } from '@/types/assets'
import { LSP7DigitalAsset as LSP7DigitalAssetInterface } from '@/types/contracts'

export const fetchLsp7Assets = async (
  address: Address,
  profileAddress: Address
): Promise<Asset> => {
  const [name, symbol, metadata] = await fetchLsp4Metadata(address)

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as any,
    address
  )

  const balance = await lsp7Contract.methods.balanceOf(profileAddress).call()
  const tokenSupply = await lsp7Contract.methods.totalSupply().call()
  const decimals = Number(await lsp7Contract.methods.decimals().call())
  const icon =
    (await getAndConvertImage(metadata.LSP4Metadata.icon, 200)) ||
    ASSET_ICON_PLACEHOLDER_URL
  const { links, description } = metadata.LSP4Metadata
  const images: Base64EncodedImage[] = []

  for await (const image of metadata.LSP4Metadata.images) {
    const convertedImage = await getAndConvertImage(image, 400)
    if (convertedImage) {
      images.push(convertedImage)
    }
  }

  return {
    address,
    name,
    symbol,
    amount: balance,
    decimals: decimals,
    tokenSupply,
    icon,
    links,
    description,
    images,
    metadata: metadata.LSP4Metadata,
    standard: 'LSP7DigitalAsset',
  }
}
