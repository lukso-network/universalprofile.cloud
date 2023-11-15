import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { LSP0ERC725Account } from '@/types/contracts/LSP0ERC725Account'
import { ProfileRepository } from '@/repositories/profile'

export const fetchProfile = async (profileAddress: Address) => {
  const { isLoadingProfile } = storeToRefs(useAppStore())
  const profileRepo = useRepo(ProfileRepository)

  const storeProfile = profileRepo.getProfileAndImages(profileAddress)

  if (storeProfile) {
    const profileData = await fetchLsp3ProfileData(profileAddress)

    // check if profile metadata hash has changed
    if (getHash(profileData.value) === getHash(storeProfile)) {
      await updateLyxBalance(profileAddress)
      return
    }
  }

  try {
    isLoadingProfile.value = true
    const { contract, isEoA } = useWeb3(PROVIDERS.RPC)

    // EoA check
    if (await isEoA(profileAddress)) {
      throw new EoAError(profileAddress)
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

    const profile = await fetchLsp3Profile(profileAddress)

    profileRepo.saveProfile(profile)
  } catch (error: unknown) {
    throw error
  } finally {
    isLoadingProfile.value = false
  }
}
