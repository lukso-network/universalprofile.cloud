import type { FiltersAssetType } from '@/types/filters'
import type {
  SelectProfileOption,
  SelectStringOption,
} from '@lukso/web-components'

const FILTER_DEFAULTS: Filters = {
  assetType: 'owned',
  assetGroup: 'collectibles',
  orderBy: 'name-asc',
  search: undefined,
  collections: undefined,
  creators: undefined,
}

export const useFilters = (assets?: ComputedRef<Asset[]>) => {
  const route = useRoute()
  const { formatMessage } = useIntl()

  // filters and their defaults
  const filters = reactive<Filters>({ ...FILTER_DEFAULTS })

  //--- getters
  const isOwned = computed(() => filters.assetType === 'owned')

  const isCreated = computed(() => filters.assetType === 'created')

  const isTokens = computed(() => filters.assetGroup === 'tokens')

  const isCollectibles = computed(() => filters.assetGroup === 'collectibles')

  const orderedAssets = computed(() => {
    if (!assets) {
      return []
    }

    const [orderBy, order] = filters.orderBy.split('-')

    if (orderBy === 'name') {
      return assets.value
        ?.slice()
        .sort((a, b) => stringSort(a.tokenName, b.tokenName, order))
    }

    // since assets are ordered by default by added date, we need to reverse the array
    if (orderBy === 'added' && order === 'asc') {
      return [...assets.value].reverse()
    }

    return assets.value
  })

  const creatorFilterOptions = computed(() => {
    const creators = [] as Creator[]

    // get all creators from assets
    for (const asset of orderedAssets.value) {
      if (asset?.tokenCreatorsData && asset?.tokenCreatorsData?.length > 0) {
        for (const creator of asset.tokenCreatorsData) {
          if (
            creator.address &&
            !creators.some(c => c.address === creator.address)
          ) {
            creators.push(creator)
          }
        }
      } else if (asset.ownerData) {
        if (!creators.some(c => c.address === asset.ownerData?.address)) {
          creators.push(asset.ownerData)
        }
      }
    }

    // sort creators by name
    const sortedCreators = creators
      .slice()
      .sort((a, b) => stringSort(a.name, b.name))

    // map to structure of lukso-select component
    const options: Partial<SelectProfileOption>[] = sortedCreators.map(
      creator => ({
        id: creator.address?.toLowerCase() || '',
        address: (creator.address?.toLowerCase() as Address) || '',
        name: creator.name || '',
        image: creator?.profileImage?.[0]?.url || '',
      })
    )

    // add empty option
    if (options.length === 0) {
      options.push({
        id: 'empty',
        value: formatMessage('filters_no_options'),
      } as SelectStringOption)
    }

    return options
  })

  const creatorFilterValues = (creators?: string[]) => {
    return creatorFilterOptions.value.filter(option =>
      creators?.includes(option.id as string)
    )
  }

  const collectionFilterOptions = computed(() => {
    const options = orderedAssets.value
      // match only assets that has collections
      .filter(asset => {
        // we mark owned assets as collection when there are 1+ tokenIds
        if (
          isOwned.value &&
          asset?.tokenIdsData &&
          asset.tokenIdsData?.length > 0
        ) {
          return asset
        }

        // we mark created assets as collection when they are LSP8
        if (isCreated.value && isLsp8(asset)) {
          return asset
        }
      })
      // map to structure of lukso-select component
      .map(asset => {
        return {
          id: asset.address?.toLowerCase() || '',
          value: asset.tokenName || '',
        }
      })
      // order by name
      .slice()
      .sort((a, b) => stringSort(a.value, b.value))

    // add empty option
    if (options.length === 0) {
      options.push({ id: 'empty', value: formatMessage('filters_no_options') })
    }

    return options
  })

  const collectionFilterValues = (collection?: string[]) => {
    return collectionFilterOptions.value.filter(option =>
      collection?.includes(option.id)
    )
  }

  const typeFilterValue = (type: FiltersAssetType) => {
    return typeFilterOptions.value.find(option => option.id === type)
  }

  const typeFilterOptions = computed(() => [
    { id: 'owned', value: formatMessage('filters_type_owned') },
    { id: 'created', value: formatMessage('filters_type_created') },
  ])

  //--- setters
  const setFilters = (
    filters: Partial<Filters>,
    path?: string,
    resetFilters?: boolean
  ) => {
    navigateTo({
      path: path || route.path,
      query: {
        ...(resetFilters ? FILTER_DEFAULTS : route.query),
        ...filters,
      },
    })
  }

  watch(
    () => route.query,
    queryParams => {
      const {
        assetType: assetTypeFilter,
        assetGroup: assetGroupFilter,
        search: searchFilter,
        orderBy: orderByFilter,
        collections: collectionsFilter,
        creators: creatorsFilter,
      } = queryParams as Partial<Filters>

      if (assetTypeFilter) {
        filters.assetType = assetTypeFilter
      }

      if (assetGroupFilter) {
        filters.assetGroup = assetGroupFilter
      }

      if (orderByFilter) {
        filters.orderBy = orderByFilter
      }

      if (searchFilter) {
        filters.search = searchFilter
      } else {
        filters.search = undefined
      }

      if (collectionsFilter) {
        filters.collections = [collectionsFilter].flat()
      } else {
        filters.collections = undefined
      }

      if (creatorsFilter) {
        filters.creators = [creatorsFilter].flat()
      } else {
        filters.creators = undefined
      }
    },
    { deep: true, immediate: true }
  )

  return {
    filters,
    setFilters,
    isOwned,
    isCreated,
    isTokens,
    isCollectibles,
    orderedAssets,
    creatorFilterOptions,
    creatorFilterValues,
    collectionFilterOptions,
    collectionFilterValues,
    typeFilterValue,
    typeFilterOptions,
  }
}
