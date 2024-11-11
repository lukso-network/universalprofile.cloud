export const useGridStore = defineStore(
  'grid',
  () => {
    const { connectedProfileAddress } = storeToRefs(useAppStore())

    const isEditingGrid = ref(false)
    const hasUnsavedGrid = ref(false)
    const viewedGrid = ref<Grid[]>([])
    const isSavingGrid = ref(false)
    const selectedGridId = ref<string | undefined>()
    const gridRowHeightRatio = ref(DEFAULT_GRID_ROW_HEIGHT_RATIO)
    const gridChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)
    const tempGrids = ref<Record<string, Grid[]>>({})
    const mobileLimitationsDisplayed = ref(false)

    // We use tempGrid as a proxy to the actual grid data stored in tempGrids
    const tempGrid = computed<Grid[]>({
      get: () => {
        if (!connectedProfileAddress.value) {
          return []
        }

        return (
          tempGrids.value[connectedProfileAddress.value.toLowerCase()] || []
        )
      },
      set: value => {
        if (!connectedProfileAddress.value) {
          return
        }

        tempGrids.value = {
          ...tempGrids.value,
          [connectedProfileAddress.value.toLowerCase()]: value,
        }
      },
    })

    return {
      isEditingGrid,
      hasUnsavedGrid,
      viewedGrid,
      tempGrid,
      tempGrids,
      isSavingGrid,
      selectedGridId,
      gridRowHeightRatio,
      gridChainId,
      mobileLimitationsDisplayed,
    }
  },
  {
    persist: {
      paths: [
        'isEditingGrid',
        'hasUnsavedGrid',
        'selectedGridId',
        'gridRowHeightRatio',
        'gridChainId',
        'mobileLimitationsDisplayed',
        'tempGrids',
      ],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)
