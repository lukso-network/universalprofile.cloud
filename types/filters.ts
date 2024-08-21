export type FiltersAssetType = 'owned' | 'created'

export type FiltersAssetGroup = 'collectibles' | 'tokens' | 'grid'

export type Filters = {
  assetType: FiltersAssetType
  assetGroup: FiltersAssetGroup
  orderBy: string
  search?: string
  collections?: string[]
  creators?: string[]
}
