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
    const selectedWidget = ref<GridWidgetType>()

    const selectWidget = (type?: GridWidgetType) => {
      selectedWidget.value = type
    }

    const clearWidgetData = () => {
      selectedWidget.value = undefined
    }

    return {
      isEditingGrid,
      hasUnsavedGrid,
      viewedGridLayout,
      tempGridLayout,
      gridColumns,
      isSavingGrid,
      selectedLayoutId,
      gridColumnsLarge,
      selectedWidget,
      selectWidget,
      clearWidgetData,
    }
  },
  {
    persist: {
      paths: [
        'selectedWidget',
        'hasUnsavedGrid',
        'selectedLayoutId',
        'gridColumnsLarge',
        'isEditingGrid',
        'tempGridLayout',
      ],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)