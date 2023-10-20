import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import { Asset } from '@/types/assets'
import { LSP8IdentifiableDigitalAsset as LSP8IdentifiableDigitalAssetInterface } from '@/types/contracts/LSP8IdentifiableDigitalAsset'

export const fetchLsp8Assets = async (
  address: Address,
  profileAddress: Address
) => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  const lsp8Contract = contract<LSP8IdentifiableDigitalAssetInterface>(
    LSP8IdentifiableDigitalAsset.abi as any,
    address
  )
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  // profile can have few ids of same LSP8 asset
  const tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()

  if (!tokensIds.length) {
    return []
  }

  const { fetchLsp8Metadata, fetchLSP4Creator } = useErc725() // TODO move to utils
  // nft metadata is the same for all tokens of same asset
  const [name, symbol, nftMetadata] = await fetchLsp4Metadata(address)

  const assets = await Promise.all(
    tokensIds.map(async tokenId => {
      const collectionMetadata = (await fetchLsp8Metadata(tokenId, address))
        .LSP4Metadata
      const {
        description,
        images: metadataImages,
        icon: metadataIcon,
        links,
      } = collectionMetadata
      const creatorMetadata = await fetchLSP4Creator(address)
      const {
        name: creatorName,
        address: creatorAddress,
        profileImageUrl: creatorProfileImage,
      } = creatorMetadata || {}
      const icon = await getAndConvertImage(metadataIcon, 200)
      const images: Base64EncodedImage[] = []

      for await (const image of metadataImages) {
        const convertedImage = await getAndConvertImage(image, 400)
        if (convertedImage) {
          images.push(convertedImage)
        }
      }

      return {
        address,
        name,
        symbol,
        amount: '1', // NFT is always 1
        decimals: 0, // NFT decimals are always 0
        tokenSupply,
        icon,
        links,
        description,
        images,
        creatorName,
        creatorAddress,
        creatorProfileImage,
        metadata: {
          nft: nftMetadata.LSP4Metadata,
          collection: collectionMetadata,
        },
        standard: 'LSP8IdentifiableDigitalAsset',
        tokenId,
      } as Asset
    })
  )
  return assets
}
