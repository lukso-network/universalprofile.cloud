export const useFilters = () => {
  const route = useRoute()

  // filters and their defaults
  const filters = reactive<Filters>({
    assetType: 'owned',
  })

  //--- getters
  const isOwned = computed(() => filters.assetType === 'owned')

  const isCreated = computed(() => filters.assetType === 'created')

  //--- setters
  const setFilters = (filters: Filters) => {
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
      const { assetType: assetTypeFilter } = queryParams

      if (assetTypeFilter) {
        filters.assetType = assetTypeFilter
      }
    },
    { deep: true, immediate: true }
  )

  return {
    filters,
    setFilters,
    isOwned,
    isCreated,
  }
}
