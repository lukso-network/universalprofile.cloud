export type FiltersAssetType = 'owned' | 'created'

export type FiltersAssetGroup = 'collectibles' | 'tokens'

export type Filters = {
  assetType: FiltersAssetType
  assetGroup: FiltersAssetGroup
}
