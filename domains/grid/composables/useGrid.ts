import type { GridWidget } from '@/types/grid'

export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    isConnectedUserViewingOwnProfile,
    isMobile,
  } = storeToRefs(useAppStore())
  const {
    isEditingGrid,
    hasUnsavedGrid,
    viewedGrid,
    tempGrid,
    isSavingGrid,
    selectedGridId,
  } = storeToRefs(useGridStore())

  const canEditGrid = computed(
    () =>
      isEditingGrid.value &&
      isConnected.value &&
      isConnectedUserViewingOwnProfile.value
  )

  const getGridById = (grids: Grid<GridWidget>[], id?: string) =>
    grids.find(grid => grid.id === id)

  const getSelectedGridWidgets = (grids: Grid<GridWidget>[]): GridWidget[] =>
    getGridById(grids, selectedGridId.value)?.grid || []

  const updateSelectedGrid = (
    gridWidgets: GridWidget[]
  ): Grid<GridWidget>[] => {
    const updatedGrids = tempGrid.value.map(item => {
      if (item.id === selectedGridId.value) {
        return {
          id: item.id,
          title: item.title,
          grid: gridWidgets,
          gridColumns: item.gridColumns,
        }
      }

      return item
    })

    return updatedGrids
  }

  const initSelectedGridId = () => {
    const currentGrid = canEditGrid.value ? tempGrid.value : viewedGrid.value

    if (
      !selectedGridId.value ||
      (selectedGridId.value &&
        !currentGrid.some(item => item.id === selectedGridId.value))
    ) {
      selectedGridId.value = currentGrid[0]?.id
    }
  }

  const gridCount = computed(() => {
    if (canEditGrid.value) {
      return tempGrid.value.length
    }

    return viewedGrid.value.length
  })

  return {
    initializeGrid: async (
      address?: Address,
      withAddContentPlaceholder?: boolean
    ) => {
      let grid: Grid<GridWidget>[] = []

      if (!address) {
        return []
      }

      // initialize user grid from the config stored in UP
      const _initUserGrid = async () => {
        const userGrid = await getUserGrid(address)
        grid = buildGrid(userGrid, isMobile.value, withAddContentPlaceholder)

        if (gridLog.enabled) {
          gridLog('Initialize user grid', userGrid)
        }

        viewedGrid.value = cloneObject(grid)
      }

      // in case we don't have a temp grid yet we initialize it
      const _initTempGrid = () => {
        if (tempGrid.value.length === 0 && viewedGrid.value.length !== 0) {
          tempGrid.value = cloneObject(grid)
        }
      }

      // in edit mode we initialize from temp grid
      const _initEditMode = () => {
        if (canEditGrid.value) {
          grid = buildGrid(
            tempGrid.value,
            isMobile.value,
            withAddContentPlaceholder
          )

          if (gridLog.enabled) {
            gridLog('Initialize temp grid', grid)
          }

          tempGrid.value = cloneObject(grid)
        }
      }

      await _initUserGrid()
      _initTempGrid()
      _initEditMode()
      initSelectedGridId()
    },

    addGridWidget: (
      widget: GridWidgetWithoutCords,
      grid?: Grid<GridWidget>
    ) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!grid) {
        console.warn('Grid is required')
        return
      }

      placeWidgetInGrid(widget, grid.grid, grid.gridColumns)
    },

    updateGridWidget: (id?: string, widget?: Partial<GridWidget>) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!id) {
        console.warn('Update requires an id')
        return
      }

      const gridWidgets = getSelectedGridWidgets(tempGrid.value)
      const widgetIndex = gridWidgets.findIndex(({ i }) => i === id)

      if (widgetIndex === -1) {
        console.warn('Widget not found', id)
        return
      }

      gridWidgets[widgetIndex] = {
        ...gridWidgets[widgetIndex],
        ...widget,
      }
      tempGrid.value = updateSelectedGrid(gridWidgets)
    },

    removeGridWidget: (id: string | number) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      tempGrid.value = updateSelectedGrid(
        getSelectedGridWidgets(tempGrid.value).filter(item => item.i !== id)
      )
    },

    saveGrid: async (grid?: Grid<GridWidget>[]) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!grid || !connectedProfileAddress.value) {
        return
      }

      const config = gridToConfig(grid)

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

            // rebuild grid to ensure that all widgets are in the correct position
            const grid = buildGrid(
              tempGrid.value,
              isMobile.value,
              canEditGrid.value
            )

            tempGrid.value = cloneObject(grid)
            viewedGrid.value = cloneObject(grid)
          })

          ?.on('receipt', (receipt: any) => {
            if (gridLog.enabled) {
              gridLog('Grid saved', toRaw(grid), receipt)
            }
          })
          ?.on('error', (error: Error) => {
            console.warn(error)
            isSavingGrid.value = false
          })
      } catch (error) {
        console.warn('Error saving grid', error)
        isSavingGrid.value = false
      }
    },

    addGrid: (grid: Grid<GridWidget>) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      tempGrid.value.push(grid)
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

      const index = tempGrid.value.findIndex(item => item.id === id)

      if (index === -1) {
        console.warn('Grid not found', id)
        return
      }

      tempGrid.value[index] = {
        ...tempGrid.value[index],
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

      tempGrid.value = tempGrid.value.filter(item => item.id !== id)
    },
    getSelectedGridWidgets,
    updateSelectedGrid,
    canEditGrid,
    initSelectedGridId,
    getGridById,
    gridCount,
  }
}
