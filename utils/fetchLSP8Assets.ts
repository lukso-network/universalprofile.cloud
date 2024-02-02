import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import type { AbiItem } from 'web3-utils'
import type { LSP8IdentifiableDigitalAsset } from '@/types/contracts/LSP8IdentifiableDigitalAsset'

export const createLsp8Object = async (
  address: Address,
  indexedAsset?: IndexedAsset,
  profileAddress?: Address,
  tokensId?: string[]
): Promise<Asset[]> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp8Contract = contract<LSP8IdentifiableDigitalAsset>(
    LSP8IdentifiableDigitalAssetContract.abi as AbiItem[],
    address
  )
  let tokensIds = tokensId

  // from base contract we take only name and symbol, metadata is taken from individual token id's
  const {
    name,
    symbol,
    TokenType: tokenType, // TODO change to camelcase when fixed on indexer
  } = indexedAsset || {}

  // get `tokenSupply` for the asset
  // TODO get this data from index when it's added
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  // if we want to get the LSP8 tokens for individual profile
  if (profileAddress) {
    tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()
  }

  if (!tokensIds || !tokensIds.length) {
    return []
  }

  // we check contract owner in case there are no creators set
  const owner = await lsp8Contract.methods.owner().call() // TODO fetch from Algolia when it's supported

  // fetch metadata for each token id
  const assets: Asset[] = await Promise.all(
    tokensIds.map(async tokenId => {
      // TODO fetch from Algolia when token id's are unsupported
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

      // get best image from collection based on height criteria
      const icon = createImageObject(metadataIcon, 260)

      // create image identifier so they can be linked in Pinia ORM
      const iconId = getHash(icon)

      const images: ImageMetadataWithRelationships[] = []
      const imageIds: string[] = []

      // get best image from collection based on height criteria
      for await (const image of metadataImages) {
        const convertedImage = createImageObject(image, 260)
        if (convertedImage) {
          images.push(convertedImage)
        }
      }

      // create array of image identifiers so they can be linked in Pinia ORM
      images.forEach(image => {
        const id = getHash(image)
        id && imageIds.push(id)
      })

      // get creator metadata
      // TODO refactor this to get from index
      const creators = await fetchLsp4Creators(address, tokenId, owner)

      // create creator identifiers for Pinia ORM
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
        tokenType: tokenType || 'NFT', // we set default just in case it's missing from indexer
      }
    })
  )
  return assets
}
