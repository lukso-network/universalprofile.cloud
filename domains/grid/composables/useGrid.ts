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
    const newIndex = gridLayout.value.length
    gridLayout.value.push(
      placeWidgetInSingleColumn(newItem, newIndex, currentY)
    )
  } else {
    // Place the widget in the best position in multiple columns
    const { x, y } = findBestPosition(newItem, columnHeights, gridColumns.value)
    const newIndex = gridLayout.value.length
    gridLayout.value.push(placeWidgetInLayout(newItem, newIndex, x, y))
    updateColumnHeights(columnHeights, x, newItem.w, y + newItem.h)
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
    gridLayout.value = tempGridLayout as GridWidget[]
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
