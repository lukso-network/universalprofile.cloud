const removeGridLayoutItem = (id: string) => {
  const { gridLayout, hasUnsavedGrid } = storeToRefs(useAppStore())

  if (!id || typeof id !== 'string') {
    return
  }

  gridLayout.value = gridLayout.value.filter(item => item.id !== id)
  hasUnsavedGrid.value = true
}

export const addGridLayoutItem = (newWidget: GridWidget) => {
  const { gridLayout, hasUnsavedGrid, gridColumns } = storeToRefs(useAppStore())
  const columnHeights = getColumnHeightsFromLayout(
    gridLayout.value,
    gridColumns.value
  )

  if (gridColumns.value === 1) {
    // Place the widget in a single column at the end
    const currentY = Math.max(...columnHeights)
    const newIndex = gridLayout.value.length
    gridLayout.value.push(
      placeWidgetInSingleColumn(newWidget, newIndex, currentY)
    )
  } else {
    // Place the widget in the best position in multiple columns
    const { x, y } = findBestPosition(
      newWidget,
      columnHeights,
      gridColumns.value
    )
    const newIndex = gridLayout.value.length
    gridLayout.value.push(placeWidgetInLayout(newWidget, newIndex, x, y))
    updateColumnHeights(columnHeights, x, newWidget.width, y + newWidget.height)
  }

  hasUnsavedGrid.value = true
}

const initializeGridLayout = async (address?: Address): Promise<void> => {
  const { gridLayout, hasUnsavedGrid, gridColumns } = storeToRefs(useAppStore())

  if (!address) {
    gridLayout.value = []
    return
  }

  const userGridLayout = await getGridLayout(address, gridColumns.value)
  const tempGridLayout = gridLayout.value

  if (hasUnsavedGrid.value) {
    gridLayout.value = tempGridLayout
  } else {
    gridLayout.value = userGridLayout
  }
}

export const useGrid = () => {
  return {
    removeGridLayoutItem,
    addGridLayoutItem,
    initializeGridLayout,
  }
}
