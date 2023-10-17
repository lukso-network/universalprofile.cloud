import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import { PROVIDERS } from '@/types/enums'
import { Asset } from '@/types/assets'
import { LSP8IdentifiableDigitalAsset as LSP8IdentifiableDigitalAssetInterface } from '@/types/contracts/LSP8IdentifiableDigitalAsset'

export const fetchLsp8Assets = async (
  assetAddress: Address,
  profileAddress: Address
) => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const assets: Asset[] = []

  const lsp8Contract = contract<LSP8IdentifiableDigitalAssetInterface>(
    LSP8IdentifiableDigitalAsset.abi as any,
    assetAddress
  )
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  // profile can have few ids of same LSP8 asset
  const tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()

  if (!tokensIds.length) {
    return assets
  }

  const { fetchLsp8Metadata, fetchLSP4Creator } = useErc725() // TODO move to utils
  // nft metadata is the same for all tokens of same asset
  const [name, symbol, nftMetadata] = await fetchLsp4Metadata(assetAddress)

  await Promise.all(
    tokensIds.map(async tokenId => {
      const collectionMetadata = (
        await fetchLsp8Metadata(tokenId, assetAddress)
      ).LSP4Metadata
      const { description, images, icon, links } = collectionMetadata
      const creatorMetadata = await fetchLSP4Creator(assetAddress)
      const {
        name: creatorName,
        address: creatorAddress,
        profileImageUrl: creatorProfileImage,
      } = creatorMetadata || {}

      assets.push({
        address: assetAddress,
        name,
        symbol,
        amount: '1', // NFT is always 1
        decimals: '0', // NFT decimals are always 0
        tokenSupply,
        icon: icon[0]?.url ? formatUrl(icon[0].url) : '', // TODO fetch optimal size, check existence, fallback to default
        links,
        description,
        images: images.map(image => image[2]), // TODO fetch optimal size, check for existence etc
        creatorName,
        creatorAddress,
        creatorProfileImage,
        metadata: {
          nft: nftMetadata.LSP4Metadata,
          collection: collectionMetadata,
        },
        standard: 'LSP8IdentifiableDigitalAsset',
        tokenId,
      })
    })
  )
  return assets
}
