import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts'
import {
  isAddress,
  /*isAddress,*/ padLeft /*, toChecksumAddress*/,
  toChecksumAddress,
} from 'web3-utils'

import type { LSP0ERC725Account } from '@/types/contracts'
import type { Profile } from '@/models/profile'
import type { Creator } from '@/models/creator'

export const fetchLsp4Creators = async (
  assetAddress: Address,
  tokenId?: string
) => {
  const { contract } = useWeb3(PROVIDERS.RPC)

  try {
    // TODO use erc725 instead
    const creatorsNumber = Number(
      await contract<LSP0ERC725Account>(getDataABI, assetAddress)
        .methods.getData(ERC725YDataKeys.LSP4['LSP4Creators[]'].length)
        .call()
    )

    if (creatorsNumber === 0) {
      return []
    }

    const creators: Creator[] = []
    for (let i = 1; i <= creatorsNumber; i++) {
      // TODO use erc725 instead
      const creatorAddress = await contract<LSP0ERC725Account>(
        getDataABI,
        assetAddress
      )
        .methods.getData(
          ERC725YDataKeys.LSP4['LSP4Creators[]'].index +
            padLeft((i - 1).toString(), 32)
        )
        .call()

      assertAddress(creatorAddress)
      let profile: Profile = {
        address: toChecksumAddress(creatorAddress) as Address,
      }

      try {
        // TODO rework thi to get creators from Algolia index
        profile = {
          ...(await fetchProfile(creatorAddress)),
          ...profile,
        }
      } catch (error) {
        console.warn(`Failed to fetch creator ${creatorAddress}`)
      }
      const issuedAssets =
        (profile?.issuedAssetAddresses &&
          profile.issuedAssetAddresses.filter(address => {
            if (isAddress(address)) {
              return toChecksumAddress(address)
            }
          })) ||
        []
      const isVerified = issuedAssets.includes(assetAddress)

      creators.push({
        profileId: toChecksumAddress(creatorAddress) as Address,
        profile,
        assetId: assetAddress,
        tokenId,
        isVerified,
      })
    }

    return creators
  } catch (error) {
    console.error(error)
  }
}
