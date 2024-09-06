export type FiltersAssetType = 'owned' | 'created'

export type FiltersAssetGroup = 'collectibles' | 'tokens'

export type FiltersAttribute = {
  group: string
  value: string
}

export type Filters = {
  assetType: FiltersAssetType
  assetGroup: FiltersAssetGroup
  orderBy: string
  search?: string
  collections?: string[]
  creators?: string[]
  attributes?: string
}
