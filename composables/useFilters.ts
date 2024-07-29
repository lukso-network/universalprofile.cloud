export const useFilters = () => {
  const route = useRoute()

  // filters and their defaults
  const filters = reactive<Filters>({
    assetType: 'owned',
    assetGroup: 'collectibles',
    orderBy: 'name-asc',
    search: undefined,
    collections: undefined,
    creators: undefined,
  })

  //--- getters
  const isOwned = computed(() => filters.assetType === 'owned')

  const isCreated = computed(() => filters.assetType === 'created')

  const isTokens = computed(() => filters.assetGroup === 'tokens')

  const isCollectibles = computed(() => filters.assetGroup === 'collectibles')

  //--- setters
  const setFilters = (filters: Partial<Filters>) => {
    navigateTo({
      path: route.path,
      query: {
        ...route.query,
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
  }
}
