const removeGridLayoutItem = (id: string | number) => {
  const { gridLayout, hasUnsavedGrid } = storeToRefs(useAppStore())

  if (typeof id !== 'string' && typeof id !== 'number') {
    return
  }

  gridLayout.value = gridLayout.value.filter(item => item.i !== id)
  hasUnsavedGrid.value = true
}

export const addGridLayoutItem = (newItem: GridWidgetWithoutCords) => {
  const { gridLayout, hasUnsavedGrid, gridColumns } = storeToRefs(useAppStore())
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
    const { x, y } = findBestPosition(newItem, columnHeights, gridColumns.value)
    gridLayout.value.push(placeWidgetInLayout(newItem, x, y))
    updateColumnHeights(columnHeights, x, newItem.w, y + newItem.h)
  }

  hasUnsavedGrid.value = true
}

const initializeGridLayout = async (address?: Address): Promise<void> => {
  const { gridLayout, hasUnsavedGrid, gridColumns, isConnected } =
    storeToRefs(useAppStore())
  let layout: GridWidget[] = []

  if (!address) {
    gridLayout.value = []
    return
  }

  if (hasUnsavedGrid.value) {
    layout = buildLayout(gridLayout.value, gridColumns.value, isConnected.value)
  } else {
    const userLayout = await getUserLayout(address)
    layout = buildLayout(userLayout, gridColumns.value, isConnected.value)
  }

  gridLayout.value = layout
}

const saveGridLayout = async (layout?: GridWidget[]) => {
  const { hasUnsavedGrid, connectedProfileAddress } = storeToRefs(useAppStore())

  if (!layout || !connectedProfileAddress.value) {
    return
  }

  // remove "add widget" item from layout before saving
  const layoutWithoutAddWidget = layout.filter(
    item => item.type !== GRID_WIDGET_TYPE.ADD_WIDGET
  )
  const config = layoutToConfig(layoutWithoutAddWidget)

  if (!isConfigValid(config)) {
    console.warn('Invalid schema 😡')
    return
  }

  const response = await saveConfig(connectedProfileAddress.value, config)

  if (!response) {
    console.warn('Failed to save layout 😢')
    return
  }

  console.log('Layout saved 🎉', response)
  hasUnsavedGrid.value = false
}

export const useGrid = () => {
  return {
    initializeGridLayout,
    addGridLayoutItem,
    removeGridLayoutItem,
    saveGridLayout,
  }
}
