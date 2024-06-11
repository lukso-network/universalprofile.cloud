import {
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
  type LinkMetadata,
} from '@lukso/lsp-smart-contracts'
import { useQueries } from '@tanstack/vue-query'

import type { ProfileAssetsQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = ProfileAssetsQuery
type QueryResultProfile = ProfileAssetsQuery['Profile']
type QueryResultReceivedAsset =
  ProfileAssetsQuery['Profile'][0]['receivedAssets'][0]['asset']
type QueryResultIssuedAsset =
  ProfileAssetsQuery['Profile'][0]['lsp12IssuedAssets'][0]['asset']
type QueryResultHolds = ProfileAssetsQuery['Profile'][0]['holds']
type QueryResultHoldToken =
  ProfileAssetsQuery['Profile'][0]['holds'][0]['token']

export function useProfileAssetsGraph() {
  return ({ profileAddress: _profileAddress }: FiltersProfileAssets) => {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: '' } } = currentNetwork

    const queries = computed(() => {
      const profileAddress = unref(_profileAddress)

      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        profileAddress
          ? [
              {
                // 0
                queryKey: [
                  'profile-received-assets-graph',
                  profileAddress,
                  chainId,
                ],
                queryFn: async () => {
                  const { Profile: profiles }: QueryResult =
                    await GqlProfileAssets({
                      address: profileAddress,
                    })

                  if (graphLog.enabled) {
                    graphLog('received-assets', profiles)
                  }

                  return profiles as QueryResultProfile
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
            ]
          : []
      ) as QFQueryOptions[] & AdditionalQueryOptions
      queries.profileAddress = profileAddress
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const data = results[0]?.data as QueryResultProfile | undefined

        const profilesData = data?.[0]

        const {
          receivedAssets: lsp5ReceivedAssets,
          holds,
          lsp12IssuedAssets,
        } = profilesData || {}

        const receivedAssets =
          lsp5ReceivedAssets?.flatMap(receivedAsset => {
            const tokenIdsData: Asset[] = []

            if (receivedAsset.asset?.standard === STANDARDS.LSP8) {
              holds?.filter(hold => {
                if (hold.token?.baseAsset?.id === receivedAsset.asset?.id) {
                  tokenIdsData.push({
                    ...createAssetObject(
                      receivedAsset.asset,
                      hold?.token,
                      [],
                      hold.balance,
                      hold.token?.tokenId
                    ),
                    isOwned: true,
                    isIssued: false,
                  })
                }
              })
            }

            if (tokenIdsData.length === 1) {
              return tokenIdsData
            }

            return {
              ...createAssetObject(
                receivedAsset.asset,
                receivedAsset.asset,
                tokenIdsData,
                getBalanceForHold(holds, receivedAsset?.asset?.id) || '0'
              ),
              isOwned: true,
              isIssued: false,
            }
          }) || []

        const issuedAssets =
          lsp12IssuedAssets?.flatMap(issuedAsset => {
            return {
              ...createAssetObject(
                issuedAsset.asset,
                issuedAsset.asset,
                [],
                getBalanceForHold(holds, issuedAsset?.asset?.id) || '0'
              ),
              isOwned: false,
              isIssued: true,
            }
          }) || []

        if (graphLog.enabled) {
          graphLog('profile-assets', [...receivedAssets, ...issuedAssets])
        }

        return [...receivedAssets, ...issuedAssets]
      },
    })
  }
}

const createAssetObject = (
  receivedAsset: QueryResultReceivedAsset | QueryResultIssuedAsset,
  rawMetadata:
    | QueryResultReceivedAsset
    | QueryResultIssuedAsset
    | QueryResultHoldToken,
  tokenIdsData: Asset[],
  balance: string,
  tokenId?: string
) => {
  const metadata = prepareMetadata({
    LSP4Metadata: {
      images: unflatArray(rawMetadata?.images as Image[][]),
      icon: rawMetadata?.icons as Image[],
      description: rawMetadata?.description as string,
      assets: rawMetadata?.assets as AssetMetadata[],
      attributes: rawMetadata?.attributes as AttributeMetadata[],
      links: rawMetadata?.links as LinkMetadata[],
    },
  })

  const asset = {
    address: receivedAsset?.id,
    balance,
    standard: receivedAsset?.standard,
    owner: receivedAsset?.owner?.id,
    ownerData: {
      address: receivedAsset?.owner?.id,
      name: receivedAsset?.owner?.name,
      profileImage: prepareImages(receivedAsset?.owner?.profileImages),
    },
    resolvedMetadata: metadata,
    decimals: receivedAsset?.decimals,
    totalSupply: receivedAsset?.totalSupply,
    tokenName: receivedAsset?.lsp4TokenName,
    tokenSymbol: receivedAsset?.lsp4TokenSymbol,
    tokenType: receivedAsset?.lsp4TokenType || LSP4_TOKEN_TYPES.TOKEN,
    tokenIdFormat:
      receivedAsset?.lsp8TokenIdFormat || LSP8_TOKEN_ID_FORMAT.NUMBER,
    tokenCreators: receivedAsset?.lsp4Creators.map(
      creator => creator?.profile?.id
    ),
    tokenCreatorsData: receivedAsset?.lsp4Creators.map(creator => {
      return {
        address: creator?.profile?.id,
        name: creator?.profile?.name,
        profileImage: prepareImages(creator?.profile?.profileImages),
      }
    }),
    tokenId,
    tokenIdsData,
  } as Asset

  return asset
}

const getBalanceForHold = (holds?: QueryResultHolds, _address?: string) => {
  const address = _address?.toLowerCase()
  return holds?.find(
    hold =>
      hold?.asset?.id.toLowerCase() === address ||
      hold?.token?.baseAsset?.id.toLowerCase() === address
  )?.balance
}
