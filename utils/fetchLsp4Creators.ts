import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import { ERC725YDataKeys } from '@lukso/lsp-smart-contracts'
import { isAddress, padLeft, toChecksumAddress } from 'web3-utils'
import { ERC725JSONSchema } from '@erc725/erc725.js'

import { LSP0ERC725Account } from '@/types/contracts'
import { Creator } from '@/types/profile'

export const fetchLsp4Creators = async (
  assetAddress: Address
): Promise<Creator[] | undefined> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const { getInstance } = useErc725()

  try {
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
      const erc725 = getInstance(
        creatorAddress,
        LSP3ProfileMetadata.concat() as ERC725JSONSchema[]
      )
      const fetchedProfile = await erc725.fetchData([
        'LSP3Profile',
        'LSP12IssuedAssets[]',
      ])
      const lsp3Profile = validateLsp3Metadata(fetchedProfile[0])
      const profileImage =
        lsp3Profile.profileImage &&
        (await getAndConvertImage(lsp3Profile.profileImage, 200))
      const issuedAssets = (fetchedProfile[1].value as Address[]).filter(
        address => {
          if (isAddress(address)) {
            return toChecksumAddress(address)
          }
        }
      )
      const isVerified = issuedAssets.includes(assetAddress)
      creators.push({
        address: creatorAddress,
        profileImage,
        name: lsp3Profile.name,
        isVerified,
      })
    }

    return creators
  } catch (error) {
    console.error(error)
  }
}
