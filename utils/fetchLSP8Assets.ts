// import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

// import type { AbiItem } from 'web3-utils'
// import type { LSP8IdentifiableDigitalAsset } from '@/types/contracts/LSP8IdentifiableDigitalAsset'
// import type { Image } from '@/types/image'

// export const createLsp8Object = async (
//   address: Address,
//   indexedAsset?: IndexedAsset,
//   profileAddress?: Address,
//   tokensId?: string[]
// ): Promise<Asset[]> => {
//   const { contract } = useWeb3(PROVIDERS.RPC)
//   const lsp8Contract = contract<LSP8IdentifiableDigitalAsset>(
//     LSP8IdentifiableDigitalAssetContract.abi as AbiItem[],
//     address
//   )
//   let tokensIds = tokensId

//   // from base contract we take only name and symbol, metadata is taken from individual token id's
//   const {
//     LSP4TokenName: name,
//     LSP4TokenSymbol: symbol,
//     LSP4TokenType: tokenType,
//     LSP4Creators: creators,
//   } = indexedAsset || {}

//   // get `tokenSupply` for the asset
//   // TODO get this data from index when it's added
//   const tokenSupply = await lsp8Contract.methods.totalSupply().call()

//   // if we want to get the LSP8 tokens for individual profile
//   if (profileAddress) {
//     tokensIds = await lsp8Contract.methods.tokenIdsOf(profileAddress).call()
//   }

//   if (!tokensIds || !tokensIds.length) {
//     return []
//   }

//   // get contract owner
//   const owner = await lsp8Contract.methods.owner().call() // TODO fetch from Algolia when it's supported
//   assertAddress(owner)

//   // fetch metadata for each token id
//   const collectibles: Asset[] = []
//   for (const tokenId of tokensIds) {
//     const [collectionMetadata, tokenIdFormat] = await fetchLsp8Metadata(
//       tokenId,
//       address
//     )
//     const {
//       description,
//       images: metadataImages,
//       icon: metadataIcon,
//       links,
//       //@ts-ignore - ignore until release or lsp package
//       attributes,
//       assets,
//     } = collectionMetadata.LSP4Metadata

//     // get best image from collection based on height criteria
//     const icon = createImageObject(metadataIcon, 260)

//     const images: Image[] = []

//     // get best image from collection based on height criteria
//     for await (const image of metadataImages) {
//       const convertedImage = createImageObject(image, 260)
//       if (convertedImage) {
//         images.push(convertedImage)
//       }
//     }

//     let asset: Asset = {
//       address,
//       name,
//       symbol,
//       balance: '1', // NFT is always 1
//       decimals: 0, // NFT decimals are always 0
//       tokenSupply,
//       links,
//       description,
//       standard: STANDARDS.LSP8,
//       tokenId,
//       tokenIdFormat,
//       icon,
//       images,
//       creators: creators?.filter(Boolean), // sometimes indexer return empty string [''] so we need to filter out
//       tokenType: tokenType || 'NFT', // we set default just in case it's missing from indexer
//       contractOwner: owner,
//       attributes,
//       assets,
//     }

//     if (profileAddress) {
//       asset = { ...asset, owner: profileAddress }
//     }

//     collectibles.push(asset)
//   }
//   return collectibles
// }
