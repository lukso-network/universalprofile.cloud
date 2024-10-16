import type { GridWidget } from '@/types/grid'

export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    isConnectedUserViewingOwnProfile,
  } = storeToRefs(useAppStore())
  const {
    isEditingGrid,
    hasUnsavedGrid,
    viewedGridLayout,
    tempGridLayout,
    gridColumns,
    isSavingGrid,
    selectedLayoutId,
    gridColumnsLarge,
  } = storeToRefs(useGridStore())
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

  const initSelectedLayoutId = () => {
    const currentLayout = canEditGrid.value
      ? tempGridLayout.value
      : viewedGridLayout.value

    if (
      !selectedLayoutId.value ||
      (selectedLayoutId.value &&
        !currentLayout.some(item => item.id === selectedLayoutId.value))
    ) {
      selectedLayoutId.value = currentLayout[0]?.id
    }
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

      // initialize user layout from the config stored in UP
      const _initUserLayout = async () => {
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
      }

      // in case we don't have a temp layout yet we initialize it
      const _initTempLayout = () => {
        if (
          tempGridLayout.value.length === 0 &&
          viewedGridLayout.value.length !== 0
        ) {
          tempGridLayout.value = cloneObject(layout)
        }
      }

      // in edit mode we initialize from temp layout
      const _initEditMode = () => {
        if (canEditGrid.value) {
          layout = buildLayout(
            tempGridLayout.value,
            gridColumns.value,
            withAddContentPlaceholder
          )

          if (gridLog.enabled) {
            gridLog('Initialize temp grid', layout)
          }

          tempGridLayout.value = cloneObject(layout)
        }
      }

      await _initUserLayout()
      _initTempLayout()
      _initEditMode()
      initSelectedLayoutId()
    },

    addGridLayoutItem: (newItem: GridWidgetWithoutCords) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      placeWidgetInLayout(
        newItem,
        getSelectedLayout(tempGridLayout.value),
        gridColumns.value
      )
    },

    updateGridLayoutItem: (id?: string, widget?: Partial<GridWidget>) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!id) {
        console.warn('Update requires an id')
        return
      }

      const layout = getSelectedLayout(tempGridLayout.value)
      const widgetIndex = layout.findIndex(({ i }) => i === id)

      if (widgetIndex === -1) {
        console.warn('Widget not found', id)
        return
      }

      layout[widgetIndex] = {
        ...layout[widgetIndex],
        ...widget,
      }
      tempGridLayout.value = updateSelectedLayout(layout)
    },

    removeGridLayoutItem: (id: string | number) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      tempGridLayout.value = updateSelectedLayout(
        getSelectedLayout(tempGridLayout.value).filter(item => item.i !== id)
      )
    },

    saveGridLayout: async (layout?: Grid<GridWidget>[]) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

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

    addGrid: (grid: Grid<GridWidget>) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      tempGridLayout.value.push(grid)
    },

    updateGrid: (
      id?: string,
      grid?: PartialBy<Grid<GridWidget>, 'id' | 'grid'>
    ) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!id) {
        console.warn('Grid update requires an id')
        return
      }

      if (!grid?.title) {
        console.warn('Grid update requires a title')
        return
      }

      const index = tempGridLayout.value.findIndex(item => item.id === id)

      if (index === -1) {
        console.warn('Grid not found', id)
        return
      }

      tempGridLayout.value[index] = {
        ...tempGridLayout.value[index],
        ...{
          ...grid,
        },
      }
    },

    removeGrid: (id: string) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      tempGridLayout.value = tempGridLayout.value.filter(item => item.id !== id)
    },

    getGridColumns: computed(() => (width: number): number => {
      return width > GRID_BREAKPOINT_PX
        ? gridColumnsLarge.value
        : DEFAULT_SMALL_COLUMN_NUMBER
    }),
    getSelectedLayout,
    updateSelectedLayout,
    canEditGrid,
    initSelectedLayoutId,
  }
}
