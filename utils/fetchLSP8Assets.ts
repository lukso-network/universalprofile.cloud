import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'
import LSP8IdentifiableDigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'

import { LSP8Asset } from '@/types/assets'
import { PROVIDERS } from '@/types/enums'

export const fetchLSP8Assets = async (
  assetAddress: Address,
  profileAddress: Address
) => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  const lsp8Contract = contract(
    LSP8IdentifiableDigitalAsset.abi as any,
    assetAddress
  )
  const tokenSupply = await lsp8Contract.methods.totalSupply().call()

  // profile can have few ids of same LSP8 asset
  const tokensIds = (await lsp8Contract.methods
    .tokenIdsOf(profileAddress)
    .call()) as string[]

  if (!tokensIds.length) {
    return
  }

  const { fetchLSP4Metadata, fetchLSP8Metadata, fetchLSP4Creator } = useErc725()
  const [collectionName, collectionSymbol, collectionLSP4Metadata] =
    await fetchLSP4Metadata(assetAddress)

  const newLSP8Assets: LSP8Asset[] = []

  await Promise.all(
    tokensIds.map(async tokenId => {
      const nftMetadata = await fetchLSP8Metadata(tokenId, assetAddress)
      const creatorMetadata = await fetchLSP4Creator(assetAddress)

      const lsp8AssetObject: LSP8Asset = createLSP8Object(
        assetAddress,
        tokenId,
        tokenSupply,
        collectionName,
        collectionSymbol,
        nftMetadata,
        collectionLSP4Metadata,
        creatorMetadata
      )
      newLSP8Assets.push(lsp8AssetObject)
    })
  )
  return newLSP8Assets
}

const createLSP8Object = (
  assetAddress: Address,
  tokenId: string,
  tokenSupply: string,
  collectionName: string,
  collectionSymbol: string,
  nftMetadata: LSP4DigitalAssetJSON,
  collectionMetadata: LSP4DigitalAssetJSON,
  creatorMetadata?: Creator
): LSP8Asset => {
  const { description, images, icon } = nftMetadata.LSP4Metadata
  const {
    description: collectionDescription,
    images: collectionImages,
    icon: collectionIcon,
    links: collectionLinks,
  } = collectionMetadata.LSP4Metadata
  const {
    name: creatorName,
    address: creatorAddress,
    profileImageUrl: creatorProfileImage,
  } = creatorMetadata || {}

  const lsp8AssetObject = {
    tokenId,
    description,
    image: images[0][0]?.url ? formatUrl(images[0][0].url) : '',
    icon: icon[0]?.url ? formatUrl(icon[0].url) : '',
    collectionName,
    collectionSymbol,
    collectionAddress: assetAddress,
    collectionDescription,
    collectionImages,
    collectionLinks,
    collectionIcon: formatUrl(collectionIcon[0]?.url)
      ? collectionIcon[0]?.url
      : '',
    creatorName,
    creatorAddress,
    creatorProfileImage,
    tokenSupply,
  }
  return lsp8AssetObject as LSP8Asset
}
