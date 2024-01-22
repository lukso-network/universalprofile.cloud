import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import type { AbiItem } from 'web3-utils'
import type { LSP8IdentifiableDigitalAsset } from '@/types/contracts/LSP8IdentifiableDigitalAsset'

export const fetchLsp8Assets = async (
  address: Address,
  profileAddress?: Address,
  tokensId?: string[]
): Promise<Asset[]> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp8Contract = contract<LSP8IdentifiableDigitalAsset>(
    LSP8IdentifiableDigitalAssetContract.abi as AbiItem[],
    address
  )
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  let tokensIds = tokensId

  // if we want to get the LSP8 tokens for individual profile
  if (profileAddress) {
    tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()
  }

  if (!tokensIds || !tokensIds.length) {
    return []
  }

  // nft metadata is the same for all tokens of same asset
  const [name, symbol, nftMetadata] = await fetchLsp4Metadata(address)

  const assets: Asset[] = await Promise.all(
    tokensIds.map(async tokenId => {
      const [collectionMetadata, tokenIdFormat] = await fetchLsp8Metadata(
        tokenId,
        address
      )
      const {
        description,
        images: metadataImages,
        icon: metadataIcon,
        links,
      } = collectionMetadata.LSP4Metadata
      const icon = await createImageObject(metadataIcon, 260)
      const images: ImageMetadataWithRelationships[] = []
      const creators = await fetchLsp4Creators(address, tokenId)

      for await (const image of metadataImages) {
        const convertedImage = await createImageObject(image, 260)
        if (convertedImage) {
          images.push(convertedImage)
        }
      }

      const imageIds: string[] = []
      images.forEach(image => {
        const id = getHash(image)
        id && imageIds.push(id)
      })

      const iconId = getHash(icon)

      const creatorIds: Address[] = []
      creators?.forEach(creator => {
        creator?.profile?.address && creatorIds.push(creator.profile.address)
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
        standard: 'LSP8DigitalAsset',
        tokenId,
        tokenIdFormat,
        icon,
        iconId,
        images,
        imageIds,
        creators,
        creatorIds,
        owner: profileAddress,
      }
    })
  )
  return assets
}
