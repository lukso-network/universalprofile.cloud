export const useFilters = () => {
  const route = useRoute()

  // filters and their defaults
  const filters = reactive<Filters>({
    assetType: 'owned',
    assetGroup: 'collectibles',
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
      const { assetType: assetTypeFilter, assetGroup: assetGroupFilter } =
        queryParams

      if (assetTypeFilter) {
        filters.assetType = assetTypeFilter
      }

      if (assetGroupFilter) {
        filters.assetGroup = assetGroupFilter
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
