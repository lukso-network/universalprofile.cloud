export const useGrid = () => {
  const {
    isConnected,
    connectedProfileAddress,
    isViewingOwnProfile,
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
    () => isEditingGrid.value && isConnected.value && isViewingOwnProfile.value
  )

  const getGridById = (grid: Grid[], id?: string) =>
    grid.find(item => item.id === id)

  const getSelectedGridWidgets = (grid: Grid[]): GridWidget[] =>
    getGridById(grid, selectedGridId.value)?.grid || []

  const updateSelectedGrid = (gridWidgets: GridWidget[]): Grid[] => {
    const updatedGrid = tempGrid.value.map(item => {
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

    return updatedGrid
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

  const gridsForDisplay = computed(() => {
    const grids = canEditGrid.value
      ? tempGrid.value
      : viewedGrid.value.filter(grid => grid.grid.length > 0)

    return grids.map(grid => {
      return {
        grid,
      }
    })
  })

  const gridsForTabs = computed(() => {
    const grids =
      isConnected.value && isViewingOwnProfile.value
        ? tempGrid.value
        : viewedGrid.value.filter(grid => grid.grid.length > 0)

    return grids.map(grid => {
      return {
        grid,
      }
    })
  })

  return {
    initializeGrid: async (
      address?: Address,
      withAddContentPlaceholder?: boolean
    ) => {
      let grid: Grid[] = []

      if (!address) {
        return []
      }

      // initialize user grid from the config stored in UP
      const _initUserGrid = async () => {
        const userGrid = await getUserGrid(address)
        grid = buildGrid(userGrid, isMobile.value, withAddContentPlaceholder)

        if (grid.length === 0) {
          grid = cloneObject(EMPTY_GRID)
        }

        if (gridLog.enabled) {
          gridLog('Initialize user grid', userGrid)
        }

        viewedGrid.value = cloneObject(grid)
      }

      // in case we don't have a temp grid yet we initialize it
      const _initTempGrid = () => {
        if (
          tempGrid.value.length === 0 &&
          viewedGrid.value.length !== 0 &&
          isViewingOwnProfile.value
        ) {
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

    addGridWidget: (widget: GridWidgetWithoutCords, grid?: Grid) => {
      if (!isConnected.value) {
        console.warn('User not connected')
        return
      }

      if (!grid) {
        console.warn('Grid is required')
        return
      }

      if (gridLog.enabled) {
        gridLog('Add grid widget', widget)
      }

      // widget is added at the end and doesn't have x/y cords yet but findBestPosition algorithm will add them later
      grid.grid.push(widget as GridWidget)
    },

    updateGridWidget: (id?: string, widget?: Partial<GridWidget>) => {
      if (!isConnected.value) {
        console.warn('User not connected')
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

      if (gridLog.enabled) {
        gridLog('Update grid widget', gridWidgets[widgetIndex])
      }

      tempGrid.value = updateSelectedGrid(gridWidgets)
    },

    removeGridWidget: (id: string | number) => {
      if (!isConnected.value) {
        console.warn('User not connected')
        return
      }

      if (typeof id !== 'string' && typeof id !== 'number') {
        return
      }

      if (gridLog.enabled) {
        gridLog('Remove grid widget', id)
      }

      tempGrid.value = updateSelectedGrid(
        getSelectedGridWidgets(tempGrid.value).filter(item => item.i !== id)
      )
    },

    saveGrid: async (grid?: Grid[]) => {
      if (!canEditGrid.value) {
        console.warn('User cannot edit grid')
        return
      }

      if (!grid || !connectedProfileAddress.value) {
        return
      }

      const config = gridToConfig(grid)
      const validation = await gridConfigSchema.array().safeParseAsync(config)

      if (!validation.success) {
        console.warn('Invalid schema', validation.error)
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

    addGrid: (grid: Grid) => {
      if (!isConnected.value) {
        console.warn('User not connected')
        return
      }

      tempGrid.value.push(grid)
    },

    updateGrid: (id?: string, grid?: Partial<Grid>) => {
      if (!isConnected.value) {
        console.warn('User not connected')
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
      if (!isConnected.value) {
        console.warn('User not connected')
        return
      }

      tempGrid.value = tempGrid.value.filter(item => item.id !== id)
    },
    getSelectedGridWidgets,
    updateSelectedGrid,
    canEditGrid,
    initSelectedGridId,
    getGridById,
    gridsForDisplay,
    gridsForTabs,
  }
}
