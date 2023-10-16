import {
  Asset,
  AssetFilter,
  InterfaceId,
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
  const ownedAssets = ref<Asset[]>()
  const createdAssets = ref<Asset[]>()

  // --- getters

  const tokens = computed(() => {
    return (assetFilter: AssetFilter) => {
      let assets: Asset[] = []

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
        assets?.filter(asset =>
          tokenStandards.includes(asset.standard as InterfaceId)
        ) || []
      )
    }
  })

  const nfts = computed(() => {
    return (assetFilter: AssetFilter) => {
      let assets: Asset[] = []

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
        assets?.filter(nft =>
          nftStandards.includes(nft.standard as InterfaceId)
        ) || []
      )
    }
  })

  const getToken = computed(() => {
    return (tokenAddress: Address) => {
      const assets = ownedAssets.value?.concat(createdAssets.value || [])

      return assets?.find(asset => asset.address === tokenAddress)
    }
  })

  const getNft = computed(() => {
    return (nftAddress: Address, tokenId: string) => {
      const assets = ownedAssets.value?.concat(createdAssets.value || [])

      return assets?.find(
        asset => asset.address === nftAddress && asset.tokenId === tokenId
      )
    }
  })

  // --- actions

  const setOwnedAssets = (assets: Asset[]) => {
    ownedAssets.value = assets
  }

  const setCreatedAssets = (assets: Asset[]) => {
    createdAssets.value = assets
  }

  const setStatus = (statusName: keyof typeof status, newStatus: boolean) => {
    status[statusName] = newStatus
  }

  const setBalance = (assetAddress: Address, balance: string) => {
    const ownedAssetsUpdated = ownedAssets.value?.map(asset => {
      if (asset.address === assetAddress) {
        asset.amount = balance
      }

      return asset
    })

    ownedAssetsUpdated && setOwnedAssets(ownedAssetsUpdated)
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
    setBalance,
  }
})
