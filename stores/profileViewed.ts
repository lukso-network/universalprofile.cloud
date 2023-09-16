import {
  AssetFilter,
  InterfaceId,
  Nft,
  SupportedAssets,
  Token,
  nftStandards,
  tokenStandards,
} from '@/types/assets'

/**
 * Viewed profile store
 *
 * Keeps the information about currently viewed profile
 *
 */
export const useViewedProfileStore = defineStore('profileViewed', () => {
  const profile = reactive<Profile>({} as Profile)
  const status = reactive({ isProfileLoading: true, isAssetLoading: true })
  const assetFilter = ref<AssetFilter>(AssetFilter.owned)
  const ownedAssets = ref<SupportedAssets[]>()
  const createdAssets = ref<SupportedAssets[]>()

  // --- getters

  const tokens = computed(() => {
    return (assetFilter: AssetFilter) => {
      let assets: SupportedAssets[] = []

      switch (assetFilter) {
        case AssetFilter.owned:
          assets = ownedAssets.value || []
          break
        case AssetFilter.created:
          assets = createdAssets.value || []
          break
        default:
          return []
      }

      return (
        (assets?.filter(asset =>
          tokenStandards.includes(asset.standard as InterfaceId)
        ) as Token[]) || []
      )
    }
  })

  const nfts = computed(() => {
    return (assetFilter: AssetFilter) => {
      let assets: SupportedAssets[] = []

      switch (assetFilter) {
        case AssetFilter.owned:
          assets = ownedAssets.value || []
          break
        case AssetFilter.created:
          assets = createdAssets.value || []
          break
        default:
          return []
      }

      return (
        (assets?.filter(nft =>
          nftStandards.includes(nft.standard as InterfaceId)
        ) as Nft[]) || []
      )
    }
  })

  const getToken = computed(() => {
    return (tokenAddress: Address) => {
      const assets = ownedAssets.value?.concat(createdAssets.value || [])

      return assets?.find(asset => asset.address === tokenAddress) as Token
    }
  })

  const getNft = computed(() => {
    return (nftAddress: Address, tokenId: string) => {
      const assets = ownedAssets.value?.concat(createdAssets.value || [])

      return assets?.find(
        asset =>
          asset.address === nftAddress &&
          'tokenId' in asset.data &&
          asset.data.tokenId === tokenId
      ) as Nft
    }
  })

  // --- actions

  const setOwnedAssets = (assets: SupportedAssets[]) => {
    ownedAssets.value = assets
  }

  const setCreatedAssets = (assets: SupportedAssets[]) => {
    createdAssets.value = assets
  }

  const setStatus = (statusName: keyof typeof status, newStatus: boolean) => {
    status[statusName] = newStatus
  }

  return {
    ...useProfileBase(profile),
    profile,
    status,
    setStatus,
    ownedAssets,
    setOwnedAssets,
    tokens,
    assetFilter,
    createdAssets,
    nfts,
    setCreatedAssets,
    getToken,
    getNft,
  }
})
