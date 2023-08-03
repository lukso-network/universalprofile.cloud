import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { eip165ABI } from '@/shared/abis/eip165ABI'
import { PROVIDERS } from '@/types/enums'
import { getDataABI } from '@/shared/abis/getDataABI'

export const fetchProfile = async () => {
  // get profile address from router (url)
  const router = useRouter()
  const { setAddress, setProfile } = useProfileStore()
  const profileAddress = router.currentRoute.value.params.profileAddress

  // valid address check
  assertAddress(profileAddress)
  setAddress(profileAddress)

  // interface check
  const { contract } = useWeb3(PROVIDERS.RPC)
  const eip165Contract = contract(eip165ABI as any, profileAddress)
  await eip165Contract.methods
    .supportsInterface(INTERFACE_IDS.LSP0ERC725Account)
    .call()

  // standard check
  const supportedStandard = await contract(getDataABI, profileAddress)
    .methods['getData(bytes32)'](SupportedStandards.LSP3UniversalProfile.key)
    .call()
  if (supportedStandard !== SupportedStandards.LSP3UniversalProfile.value) {
    throw new Error(
      `This profile contract doesn't support LSP3UniversalProfile standard`
    )
  }

  const { fetchProfile } = useErc725()
  setProfile(await fetchProfile(profileAddress))
}
