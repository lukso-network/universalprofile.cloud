import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { PROVIDERS } from '@/types/enums'
import { getDataABI } from '@/shared/abis/getDataABI'
import { checkInterface } from '@/utils/checkInterface'

export const fetchProfile = async (profileAddress: Address) => {
  const { contract, isEoA } = useWeb3(PROVIDERS.RPC)

  // EoA check
  if (await isEoA(profileAddress)) {
    throw new Error('The profile is an EoA')
  }

  // interface check
  if (!checkInterface(profileAddress, INTERFACE_IDS.LSP0ERC725Account)) {
    throw new Error(
      `This profile contract doesn't support LSP0ERC725Account interface`
    )
  }

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
  const profile = await fetchProfile(profileAddress)
  console.log('profile', profile)

  return profile
}
