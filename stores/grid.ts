export const useGridStore = defineStore(
  'grid',
  () => {
    const selectedWidget = ref<GridWidgetType>()

    const selectWidget = (type?: GridWidgetType) => {
      selectedWidget.value = type
    }

    const clearWidgetData = () => {
      selectedWidget.value = undefined
    }

    return {
      selectedWidget,
      selectWidget,
      clearWidgetData,
    }
  },
  {
    persist: {
      paths: ['selectedWidget'],
      key: STORAGE_KEY.GRID_STORE,
    },
  }
)
