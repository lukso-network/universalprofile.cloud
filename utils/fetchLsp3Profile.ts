import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { ERC725JSONSchema } from '@erc725/erc725.js'

import { ProfileModel } from '@/models/profile'

export const fetchLsp3Profile = async (
  profileAddress: Address
): Promise<Partial<ProfileModel>> => {
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const profileMetadata = await erc725.fetchData('LSP3Profile')
  const lsp3Profile = validateLsp3Metadata(profileMetadata)
  const profileImage =
    lsp3Profile.profileImage &&
    (await getAndConvertImage(lsp3Profile.profileImage, 200))
  const backgroundImage =
    lsp3Profile.backgroundImage &&
    (await getAndConvertImage(lsp3Profile.backgroundImage, 800))

  const { getBalance } = useWeb3(PROVIDERS.RPC) // TODO move balance out so it's always fetched
  const balance = await getBalance(profileAddress)

  return {
    ...lsp3Profile,
    address: profileAddress,
    profileImage,
    backgroundImage,
    balance,
    metadata: lsp3Profile,
  }
}
