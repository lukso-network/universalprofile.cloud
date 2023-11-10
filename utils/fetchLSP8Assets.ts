import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import { LSP8IdentifiableDigitalAsset as LSP8IdentifiableDigitalAssetInterface } from '@/types/contracts/LSP8IdentifiableDigitalAsset'
import { Asset } from '@/models/asset'
import { ImageMetadataEncoded } from '@/types/assets'

export const fetchLsp8Assets = async (
  address: Address,
  profileAddress?: Address,
  tokensId?: string[]
): Promise<Asset[]> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp8Contract = contract<LSP8IdentifiableDigitalAssetInterface>(
    LSP8IdentifiableDigitalAsset.abi as any,
    address
  )
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  let tokensIds = tokensId

  if (profileAddress) {
    // profile can have few ids of same LSP8 asset
    tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()
  }

  if (!tokensIds || !tokensIds.length) {
    return []
  }

  // nft metadata is the same for all tokens of same asset
  const [name, symbol, nftMetadata] = await fetchLsp4Metadata(address)

  const assets: Asset[] = await Promise.all(
    tokensIds.map(async tokenId => {
      const collectionMetadata = (await fetchLsp8Metadata(tokenId, address))
        .LSP4Metadata
      const {
        description,
        images: metadataImages,
        icon: metadataIcon,
        links,
      } = collectionMetadata
      const icon = await getAndConvertImage(metadataIcon, 260)
      const images: ImageMetadataEncoded[] = []
      const creators = await fetchLsp4Creators(address, tokenId)

      for await (const image of metadataImages) {
        const convertedImage = await getAndConvertImage(image, 260)
        if (convertedImage) {
          images.push(convertedImage)
        }
      }

      const imageIds: string[] = []
      images.forEach(image => {
        const id = getImageId(image)
        id && imageIds.push(id)
      })

      const iconId = getImageId(icon)

      const creatorIds: string[] = []
      creators?.forEach(creator => {
        creator?.address && creatorIds.push(creator.address)
      })

      return {
        address,
        name,
        symbol,
        balance: '1', // NFT is always 1
        decimals: 0, // NFT decimals are always 0
        tokenSupply,
        links,
        description,
        metadata: {
          nft: nftMetadata.LSP4Metadata,
          collection: collectionMetadata,
        },
        standard: 'LSP8IdentifiableDigitalAsset',
        tokenId,
        icon,
        iconId,
        images,
        imageIds,
        creators,
        creatorIds,
      }
    })
  )
  return assets
}
