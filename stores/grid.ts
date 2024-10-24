export const useGridStore = defineStore(
  'grid',
  () => {
    const isEditingGrid = ref(false)
    const hasUnsavedGrid = ref(false)
    const viewedGrid = ref<Grid[]>([])
    const tempGrid = ref<Grid[]>([])
    const isSavingGrid = ref(false)
    const selectedGridId = ref<string | undefined>()
    const gridRowHeightRatio = ref(DEFAULT_GRID_ROW_HEIGHT_RATIO)
    const gridChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)

    return {
      isEditingGrid,
      hasUnsavedGrid,
      viewedGrid,
      tempGrid,
      isSavingGrid,
      selectedGridId,
      gridRowHeightRatio,
      gridChainId,
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
        'tempGrid',
      ],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)
