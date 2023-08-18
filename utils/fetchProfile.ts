import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { eip165ABI } from '@/shared/abis/eip165ABI'
import { PROVIDERS } from '@/types/enums'
import { getDataABI } from '@/shared/abis/getDataABI'
import { EoAError } from '@/shared/errors'

export const fetchProfile = async (profileAddress: Address) => {
  const { contract, isEoA } = useWeb3(PROVIDERS.RPC)

  // EoA check
  if (await isEoA(profileAddress)) {
    throw new EoAError()
  }

  // interface check
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
  const profile = await fetchProfile(profileAddress)

  return profile
}
