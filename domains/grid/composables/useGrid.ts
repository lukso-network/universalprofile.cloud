export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    hasUnsavedGrid,
    viewedGridLayout,
    tempGridLayout,
    gridColumns,
    isEditingGrid,
    isConnectedUserViewingOwnProfile,
  } = storeToRefs(useAppStore())
  const canEditGrid = computed(
    () =>
      isEditingGrid.value &&
      isConnected.value &&
      isConnectedUserViewingOwnProfile.value
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

      // unsaved state case
      if (canEditGrid.value && hasUnsavedGrid.value) {
        layout = buildLayout(
          tempGridLayout.value,
          gridColumns.value,
          withAddContentPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize temp layout', layout)
        }

        viewedGridLayout.value = [...layout]
      }

      const userLayout = await getUserLayout(address)
      layout = buildLayout(
        userLayout,
        gridColumns.value,
        withAddContentPlaceholder
      )

      if (gridLog.enabled) {
        gridLog('Initialize user layout', userLayout)
      }

      if (isConnectedUserViewingOwnProfile.value && !hasUnsavedGrid.value) {
        tempGridLayout.value = [...layout]
      }

      viewedGridLayout.value = [...layout]
    },

    addGridLayoutItem: (newItem: GridWidgetWithoutCords) => {
      placeWidgetInLayout(newItem, tempGridLayout.value, gridColumns.value)

      hasUnsavedGrid.value = true
    },

    updateGridLayoutItem: (item: GridWidget) => {
      const index = tempGridLayout.value.findIndex(({ i }) => i === item.i)

      if (index === -1) {
        return
      }

      tempGridLayout.value[index] = item
      hasUnsavedGrid.value = true
    },

    removeGridLayoutItem: (id: string | number) => {
      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      tempGridLayout.value = tempGridLayout.value.filter(item => item.i !== id)
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
