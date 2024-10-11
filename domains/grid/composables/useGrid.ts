import type { GridWidget } from '@/types/grid'

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
    isSavingGrid,
    selectedLayoutId,
    gridColumnsLarge,
  } = storeToRefs(useAppStore())
  const canEditGrid = computed(
    () =>
      isEditingGrid.value &&
      isConnected.value &&
      isConnectedUserViewingOwnProfile.value
  )

  const getSelectedLayout = (layouts: Grid<GridWidget>[]): GridWidget[] => {
    return layouts.find(grid => grid.id === selectedLayoutId.value)?.grid || []
  }

  const updateSelectedLayout = (layout: GridWidget[]): Grid<GridWidget>[] => {
    const updatedLayouts = tempGridLayout.value.map(item => {
      if (item.id === selectedLayoutId.value) {
        return {
          id: item.id,
          title: item.title,
          grid: layout,
        }
      }

      return item
    })

    return updatedLayouts
  }

  return {
    initializeGridLayout: async (
      address?: Address,
      withAddContentPlaceholder?: boolean
    ) => {
      let layout: Grid<GridWidget>[] = []

      if (!address) {
        return []
      }

      const userLayout = await getUserLayout(address)
      layout = buildLayout(
        userLayout,
        gridColumns.value,
        withAddContentPlaceholder
      )

      if (gridLog.enabled) {
        gridLog('Initialize user grid', userLayout)
      }

      viewedGridLayout.value = cloneObject(layout)

      if (
        !selectedLayoutId.value ||
        (selectedLayoutId.value &&
          !layout.some(item => item.id === selectedLayoutId.value))
      ) {
        selectedLayoutId.value = layout[0]?.id
      }

      // if there is unsaved grid we initialize temp layout
      if (canEditGrid.value && hasUnsavedGrid.value) {
        layout = buildLayout(
          tempGridLayout.value,
          gridColumns.value,
          withAddContentPlaceholder
        )

        if (gridLog.enabled) {
          gridLog('Initialize temp grid', layout)
        }
      }

      // if user is viewing his own profile we initialize temp layout
      if (isConnectedUserViewingOwnProfile.value && !hasUnsavedGrid.value) {
        tempGridLayout.value = cloneObject(layout)
      }
    },

    addGridLayoutItem: (newItem: GridWidgetWithoutCords) => {
      placeWidgetInLayout(
        newItem,
        getSelectedLayout(tempGridLayout.value),
        gridColumns.value
      )
    },

    updateGridLayoutItem: (widget: GridWidget) => {
      const layout = getSelectedLayout(tempGridLayout.value)
      const widgetIndex = layout.findIndex(({ i }) => i === widget.i)

      if (widgetIndex === -1) {
        return
      }

      layout[widgetIndex] = widget
      tempGridLayout.value = updateSelectedLayout(layout)
    },

    removeGridLayoutItem: (id: string | number) => {
      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      tempGridLayout.value = updateSelectedLayout(
        getSelectedLayout(tempGridLayout.value).filter(item => item.i !== id)
      )
    },

    saveGridLayout: async (layout?: Grid<GridWidget>[]) => {
      if (!layout || !connectedProfileAddress.value) {
        return
      }

      const config = layoutToConfig(layout)

      if (!isConfigValid(config)) {
        console.warn('Invalid schema')
        return
      }

      try {
        isSavingGrid.value = true
        return (await saveConfig(connectedProfileAddress.value, config))
          ?.send({ from: connectedProfileAddress.value })
          ?.on('transactionHash', (_hash: string) => {
            // as soon as user confirm we unblock the UI
            hasUnsavedGrid.value = false
            isSavingGrid.value = false
            isEditingGrid.value = false

            // rebuild layout to ensure that all widgets are in the correct position
            const layout = buildLayout(
              tempGridLayout.value,
              gridColumns.value,
              canEditGrid.value
            )

            tempGridLayout.value = cloneObject(layout)
            viewedGridLayout.value = cloneObject(layout)
          })

          ?.on('receipt', (receipt: any) => {
            if (gridLog.enabled) {
              gridLog('Layout saved', toRaw(layout), receipt)
            }
          })
          ?.on('error', (error: Error) => {
            console.warn(error)
            isSavingGrid.value = false
          })
      } catch (error) {
        console.warn('Error saving layout', error)
        isSavingGrid.value = false
      }
    },
    getGridColumns: computed(() => (width: number): number => {
      return width > GRID_BREAKPOINT_PX
        ? gridColumnsLarge.value
        : DEFAULT_SMALL_COLUMN_NUMBER
    }),
    getSelectedLayout,
    updateSelectedLayout,
    canEditGrid,
  }
}
