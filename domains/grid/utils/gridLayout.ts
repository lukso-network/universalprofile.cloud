export const getGridColumns = (width: number): number => {
  const breakpointsKeys = Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  const validBreakpoint = breakpointsKeys.find(bp => width >= bp)

  return validBreakpoint ? breakpoints[validBreakpoint] : COL_NUM_SMALL
}

export const placeWidgetInLayout = (
  widget: GridWidgetWithoutCords,
  layout: GridWidget[],
  gridColumns: number
): void => {
  const columnHeights = getColumnHeightsFromLayout(layout, gridColumns)
  const w = Math.min(widget.w, gridColumns)

  const { x, y } = findBestPosition(
    { ...widget, w },
    columnHeights,
    gridColumns
  )

  const newWidget: GridWidget = {
    ...widget,
    x,
    y,
    w,
    originalWidth: w < widget.w ? widget.w : undefined,
  }

  layout.push(newWidget)
}

export const findBestPosition = (
  widget: GridWidgetWithoutCords,
  columnHeights: number[],
  gridColumns: number
): { x: number; y: number } => {
  let bestY = Number.MAX_SAFE_INTEGER
  let bestX = 0

  // Iterate to strictly find left-to-right placement
  for (let x = 0; x <= gridColumns - widget.w; x++) {
    const maxY = Math.max(...columnHeights.slice(x, x + widget.w))

    // Find the earliest leftmost column available
    if (maxY < bestY || (maxY === bestY && x < bestX)) {
      bestY = maxY
      bestX = x
    }
  }

  return { x: bestX, y: bestY }
}

export const updateColumnHeights = (
  columnHeights: number[],
  x: number,
  width: number,
  newHeight: number
): void => {
  for (let i = x; i < x + width; i++) {
    columnHeights[i] = newHeight
  }
}

export const getColumnHeightsFromLayout = (
  layout: GridWidget[],
  gridColumns: number
): number[] => {
  const columnHeights = Array(gridColumns).fill(0)

  // Filter widgets that impact column heights most
  const sortedWidgets = layout.slice().sort((a, b) => b.y + b.h - (a.y + a.h))

  // Iterate through the sorted widgets until all columns are covered
  for (const widget of sortedWidgets) {
    for (let x = widget.x; x < widget.x + widget.w; x++) {
      if (columnHeights[x] < widget.y + widget.h) {
        columnHeights[x] = widget.y + widget.h
      }
    }

    // Early exit if all columns have been covered
    if (Math.min(...columnHeights) > 0) break
  }

  return columnHeights
}

/**
 * Get grid layout for a given user address and grid column number
 *
 * @param address
 * @param columns
 * @returns
 */
export const getUserLayout = async (
  address: Address
): Promise<Grid<GridWidgetWithoutCords>[]> => {
  let config: PartialBy<Grid<GridConfigItem>, 'id'>[]
  const userConfig = await getGridConfig(address)

  // if user config is invalid we load default one
  if (isConfigValid(userConfig)) {
    config = userConfig as Grid<GridConfigItem>[]
  } else {
    if (gridLog.enabled) {
      gridLog('Invalid config', userConfig)
    }

    config = defaultGridConfig(address)
  }

  return configToLayout(config)
}
