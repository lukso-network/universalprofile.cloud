export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    hasUnsavedGrid,
    connectedGridLayout,
    viewedGridLayout,
    gridColumns,
    isEditingGrid,
  } = storeToRefs(useAppStore())
  const viewedProfileAddress = getCurrentProfileAddress()

  const canEditGrid = computed(
    () =>
      isEditingGrid.value &&
      isConnected.value &&
      connectedProfileAddress.value?.toLowerCase() ===
        viewedProfileAddress.toLowerCase()
  )

  return {
    initializeGridLayout: async (
      address?: Address,
      withAddContentPlaceholder?: boolean
    ) => {
      let layout: GridWidget[] = []

      if (!address) {
        return []
      }

      if (canEditGrid.value && hasUnsavedGrid.value) {
        layout = buildLayout(
          connectedGridLayout.value,
          gridColumns.value,
          withAddContentPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize saved layout', layout)
        }

        connectedGridLayout.value = layout
      } else {
        const userLayout = await getUserLayout(address)
        layout = buildLayout(
          userLayout,
          gridColumns.value,
          withAddContentPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize user layout', userLayout)
        }

        if (
          connectedProfileAddress.value?.toLowerCase() ===
            viewedProfileAddress.toLowerCase() &&
          connectedGridLayout.value.length === 0
        ) {
          connectedGridLayout.value = layout
        }

        viewedGridLayout.value = layout
      }
    },

    addGridLayoutItem: (newItem: GridWidgetWithoutCords) => {
      const columnHeights = getColumnHeightsFromLayout(
        connectedGridLayout.value,
        gridColumns.value
      )

      if (gridColumns.value === 1) {
        // Place the widget in a single column at the end
        const currentY = Math.max(...columnHeights)
        connectedGridLayout.value.push(
          placeWidgetInSingleColumn(newItem, currentY)
        )
      } else {
        // Place the widget in the best position in multiple columns
        const { x, y } = findBestPosition(
          newItem,
          columnHeights,
          gridColumns.value
        )
        connectedGridLayout.value.push(placeWidgetInLayout(newItem, x, y))
        updateColumnHeights(columnHeights, x, newItem.w, y + newItem.h)
      }

      hasUnsavedGrid.value = true
    },

    updateGridLayoutItem: (item: GridWidget) => {
      const index = connectedGridLayout.value.findIndex(({ i }) => i === item.i)

      if (index === -1) {
        return
      }

      connectedGridLayout.value[index] = item
      hasUnsavedGrid.value = true
    },

    removeGridLayoutItem: (id: string | number) => {
      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      connectedGridLayout.value = connectedGridLayout.value.filter(
        item => item.i !== id
      )
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

    canEditGrid,
  }
}
