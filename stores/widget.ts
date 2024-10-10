export const useWidgetStore = defineStore(
  'widget',
  () => {
    const selectedWidget = ref<GridWidgetType>()
    const widgetData = ref<GridWidget>()

    const selectWidget = (type?: GridWidgetType) => {
      selectedWidget.value = type
    }

    const setWidgetData = (data: GridWidget) => {
      widgetData.value = data
    }

    const clearWidgetData = () => {
      selectedWidget.value = undefined
      widgetData.value = undefined
    }

    return {
      selectedWidget,
      selectWidget,
      clearWidgetData,
      setWidgetData,
      widgetData,
    }
  },
  {
    persist: {
      paths: ['selectedWidget', 'widgetData'],
      key: STORAGE_KEY.WIDGET_STORE,
    },
  }
)
