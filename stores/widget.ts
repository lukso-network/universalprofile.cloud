export const useWidgetStore = defineStore(
  'widget',
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
      paths: ['selectedWidget', 'widgetData'],
      key: STORAGE_KEY.WIDGET_STORE,
    },
  }
)
