import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { LSP0ERC725Account } from '@/types/contracts/LSP0ERC725Account'

export const fetchProfile = async (profileAddress: Address) => {
  const { contract, isEoA } = useWeb3(PROVIDERS.RPC)

  // EoA check
  if (await isEoA(profileAddress)) {
    throw new EoAError()
  }

  // interface check
  if (
    !(await supportInterface(profileAddress, INTERFACE_IDS.LSP0ERC725Account))
  ) {
    throw new InterfaceError('LSP0ERC725Account')
  }

  // standard check
  const supportedStandard = await contract<LSP0ERC725Account>(
    getDataABI,
    profileAddress
  )
    .methods.getData(SupportedStandards.LSP3Profile.key)
    .call()
  if (supportedStandard !== SupportedStandards.LSP3Profile.value) {
    throw new Error(
      `This profile contract doesn't support LSP3UniversalProfile standard`
    )
  }

  const [profile, profileImage, backgroundImage] = await fetchLsp3Profile(
    profileAddress
  )
  const profileRepo = useRepo(ProfileModel)
  const imageRepo = useRepo(ImageModel)

  // save into store
  profile && profileRepo.save(profile)
  profileImage && imageRepo.save(profileImage)
  backgroundImage && imageRepo.save(backgroundImage)

  return profile
}
