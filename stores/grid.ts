export const useGridStore = defineStore(
  'grid',
  () => {
    const isEditingGrid = ref(false)
    const hasUnsavedGrid = ref(false)
    const viewedGridLayout = ref<Grid<GridWidget>[]>([])
    const tempGridLayout = ref<Grid<GridWidget>[]>([])
    const gridColumns = ref<number>(DEFAULT_LARGE_COLUMN_NUMBER)
    const gridColumnsLarge = ref<number>(DEFAULT_LARGE_COLUMN_NUMBER)
    const isSavingGrid = ref(false)
    const selectedLayoutId = ref<string | undefined>()
    const gridRowHeightRatio = ref(DEFAULT_GRID_ROW_HEIGHT_RATIO)

    return {
      isEditingGrid,
      hasUnsavedGrid,
      viewedGridLayout,
      tempGridLayout,
      gridColumns,
      isSavingGrid,
      selectedLayoutId,
      gridColumnsLarge,
      gridRowHeightRatio,
    }
  },
  {
    persist: {
      paths: [
        'isEditingGrid',
        'hasUnsavedGrid',
        'selectedLayoutId',
        'gridColumnsLarge',
        'gridRowHeightRatio',
        'tempGridLayout',
      ],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)
