import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import { AbiItem } from 'web3-utils'

import { ImageMetadataWithRelationships } from '@/types/assets'
import { LSP7DigitalAsset as LSP7DigitalAssetInterface } from '@/types/contracts'
import { Asset } from '@/models/asset'

export const fetchLsp7Assets = async (
  address: Address,
  profileAddress?: Address
): Promise<Asset> => {
  const [name, symbol, metadata] = await fetchLsp4Metadata(address)
  const getData = await fetchLsp4Data(address)

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as AbiItem[],
    address
  )
  let balance = ''

  if (profileAddress) {
    balance = await fetchLsp7Balance(address, profileAddress)
  }

  const tokenSupply = await lsp7Contract.methods.totalSupply().call()
  const decimals = Number(await lsp7Contract.methods.decimals().call())
  const icon = await createImageObject(metadata.LSP4Metadata.icon, 56)
  const { links, description } = metadata.LSP4Metadata
  const images: ImageMetadataWithRelationships[] = []
  const creators = await fetchLsp4Creators(address, '')

  for await (const image of metadata.LSP4Metadata.images) {
    const convertedImage = await createImageObject(image, 100)
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
  const hash = validateHash(getData)
  const verification = validateVerification(getData)

  return {
    address,
    name,
    symbol,
    balance,
    decimals: decimals,
    tokenSupply,
    links,
    description,
    metadata: metadata.LSP4Metadata,
    standard: 'LSP7DigitalAsset',
    icon,
    iconId,
    images,
    imageIds,
    creators,
    creatorIds,
    tokenId: '',
    hash,
    verification,
  }
}
