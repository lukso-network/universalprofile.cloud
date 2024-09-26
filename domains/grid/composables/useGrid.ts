export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    hasUnsavedGrid,
    gridLayout,
    gridColumns,
  } = storeToRefs(useAppStore())
  const viewedProfileAddress = getCurrentProfileAddress()

  return {
    initializeGridLayout: async (
      address?: Address,
      withAddWidgetPlaceholder?: boolean
    ): Promise<void> => {
      let layout: GridWidget[] = []

      if (!address) {
        gridLayout.value = []
        return
      }

      if (hasUnsavedGrid.value) {
        layout = buildLayout(
          gridLayout.value,
          gridColumns.value,
          withAddWidgetPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize saved layout', gridLayout.value)
        }
      } else {
        const userLayout = await getUserLayout(address)
        layout = buildLayout(
          userLayout,
          gridColumns.value,
          withAddWidgetPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize user layout', userLayout)
        }
      }

      gridLayout.value = layout
    },

    addGridLayoutItem: (newItem: GridWidgetWithoutCords) => {
      const columnHeights = getColumnHeightsFromLayout(
        gridLayout.value,
        gridColumns.value
      )

      if (gridColumns.value === 1) {
        // Place the widget in a single column at the end
        const currentY = Math.max(...columnHeights)
        gridLayout.value.push(placeWidgetInSingleColumn(newItem, currentY))
      } else {
        // Place the widget in the best position in multiple columns
        const { x, y } = findBestPosition(
          newItem,
          columnHeights,
          gridColumns.value
        )
        gridLayout.value.push(placeWidgetInLayout(newItem, x, y))
        updateColumnHeights(columnHeights, x, newItem.w, y + newItem.h)
      }

      hasUnsavedGrid.value = true
    },

    updateGridLayoutItem: (item: GridWidget) => {
      const { gridLayout, hasUnsavedGrid } = storeToRefs(useAppStore())

      const index = gridLayout.value.findIndex(({ i }) => i === item.i)

      if (index === -1) {
        return
      }

      gridLayout.value[index] = item
      hasUnsavedGrid.value = true
    },

    removeGridLayoutItem: (id: string | number) => {
      const { gridLayout, hasUnsavedGrid } = storeToRefs(useAppStore())

      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      gridLayout.value = gridLayout.value.filter(item => item.i !== id)
      hasUnsavedGrid.value = true
    },

    saveGridLayout: async (layout?: GridWidget[]) => {
      if (!layout || !connectedProfileAddress.value) {
        return
      }

      const config = layoutToConfig(layout)

      if (!isConfigValid(config)) {
        console.warn('Invalid schema')
        return
      }

      const response = await saveConfig(connectedProfileAddress.value, config)

      if (!response) {
        console.warn('Failed to save layout')
        return
      }

      if (gridLog.enabled) {
        gridLog('Layout saved', layout, response)
      }

      hasUnsavedGrid.value = false
    },

    canEditGrid: computed(
      () =>
        isConnected.value &&
        connectedProfileAddress.value?.toLowerCase() ===
          viewedProfileAddress.toLowerCase()
    ),
  }
}
