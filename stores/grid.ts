export const useGridStore = defineStore(
  'grid',
  () => {
    const isEditingGrid = ref(false)
    const hasUnsavedGrid = ref(false)
    const viewedGridLayout = ref<Grid<GridWidget>[]>([])
    const tempGridLayout = ref<Grid<GridWidget>[]>([])
    const isSavingGrid = ref(false)
    const selectedLayoutId = ref<string | undefined>()
    const gridRowHeightRatio = ref(DEFAULT_GRID_ROW_HEIGHT_RATIO)
    const gridChainId = ref<string>(DEFAULT_NETWORK_CHAIN_ID)

    return {
      isEditingGrid,
      hasUnsavedGrid,
      viewedGridLayout,
      tempGridLayout,
      isSavingGrid,
      selectedLayoutId,
      gridRowHeightRatio,
      gridChainId,
    }
  },
  {
    persist: {
      paths: [
        'isEditingGrid',
        'hasUnsavedGrid',
        'selectedLayoutId',
        'gridRowHeightRatio',
        'gridChainId',
        'tempGridLayout',
      ],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)
