import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { ERC725JSONSchema } from '@erc725/erc725.js'
import { Buffer } from 'buffer'

import { Profile } from '@/models/profile'

export const fetchLsp3Profile = async (
  profileAddress: Address
): Promise<Profile> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const getData = (await fetchLsp3ProfileData(profileAddress))[0]
  const profileData = await erc725.fetchData([
    'LSP3Profile',
    'LSP5ReceivedAssets[]',
    'LSP12IssuedAssets[]',
  ])

  const [profileMetadata, receivedAssets, issuedAssets] = profileData

  // NOTE: Some profiles have been encoded with keccak256(bytes) instead of keccak256(utf8)
  // This little trick allows a smooth transition to the new encoding
  try {
    if (
      Object.prototype.toString.call(profileMetadata.value) ===
      '[object Uint8Array]'
    ) {
      const jsonString = Buffer.from(profileMetadata.value as any).toString(
        'utf8'
      )

      profileMetadata.value = JSON.parse(jsonString)
      console.warn(
        `LSP3Profile of ${profileAddress} was encoded with keccak256(bytes) instead of keccak256(utf8). This frontend has converted it to ensure compatibility.`
      )
    }
  } catch (err) {}

  const lsp3Profile = validateLsp3Metadata(profileMetadata)
  const profileImage =
    lsp3Profile.profileImage &&
    (await getAndConvertImage(lsp3Profile.profileImage, 96))
  const backgroundImage =
    lsp3Profile.backgroundImage &&
    (await getAndConvertImage(lsp3Profile.backgroundImage, 240))

  const { getBalance } = useWeb3(PROVIDERS.RPC)
  const balance = await getBalance(profileAddress)
  const profileImageId = getHash(profileImage)
  const backgroundImageId = getHash(backgroundImage)
  const hash = validateHash(getData)
  const verification = validateVerification(getData)

  return {
    ...lsp3Profile,
    address: profileAddress,
    balance,
    metadata: lsp3Profile,
    profileImage,
    backgroundImage,
    profileImageId,
    backgroundImageId,
    receivedAssetAddresses: receivedAssets.value as Address[],
    issuedAssetAddresses: issuedAssets.value as Address[],
    hash,
    verification,
  }
}

export const fetchLsp3ProfileData = async (profileAddress: string) => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const profileData = await erc725.getData([
    'LSP3Profile',
    'LSP5ReceivedAssets[]',
    'LSP12IssuedAssets[]',
  ])

  return profileData
}
