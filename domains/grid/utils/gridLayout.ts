import { generateItemId } from './generateItemId'

/**
 * Default grid config
 *
 * @param address
 * @returns
 */
export const defaultConfig = (address: string): GridConfigItem[] => {
  return [
    {
      type: GRID_WIDGET_TYPE.TITLE_LINK,
      width: 1,
      height: 1,
      properties: { title: address, bgColor: '#7a83ae' },
    },
    {
      type: GRID_WIDGET_TYPE.TEXT,
      width: 1,
      height: 1,
      properties: {
        title: 'Hey',
        text: 'Customize your grid layout!',
        bgColor: '#9db9b9',
      },
    },
    {
      type: GRID_WIDGET_TYPE.IMAGE,
      width: 1,
      height: 1,
      properties: { src: 'https://via.placeholder.com/150' },
    },
  ]
}

/**
 *  Check if the grid config is valid
 *
 * @param grid
 * @returns
 */
export const isConfigValid = (gridConfig?: GridConfigItem[]): boolean => {
  if (!gridConfig) {
    return false
  }

  if (
    !gridConfig.every(item => {
      return (
        item.type in GRID_WIDGET_TYPE &&
        typeof item.width === 'number' &&
        typeof item.height === 'number' &&
        typeof item.properties === 'object'
      )
    })
  ) {
    return false
  }

  return true
}

export const getGridColumns = (width: number): number => {
  const breakpointsKeys = Object.keys(breakpoints)
    .map(Number)
    .sort((a, b) => b - a)
  const validBreakpoint = breakpointsKeys.find(bp => width >= bp)

  return validBreakpoint ? breakpoints[validBreakpoint] : COL_NUM_SMALL
}

/**
 * Convert LSP27 config to grid layout
 *
 * @param config
 * @param columns
 * @returns
 */
export const configToLayout = (
  config: GridConfigItem[]
): GridWidgetWithoutCords[] => {
  const layout = config.map(item => {
    return {
      type: item.type,
      properties: item.properties,
      w: item.width,
      h: item.height,
      i: generateItemId(),
    } as GridWidgetWithoutCords
  })

  return layout
}

export const buildLayout = (
  layout: GridWidgetWithoutCords[] | GridWidget[],
  gridColumns: number,
  withAddContentPlaceholder?: boolean
): GridWidget[] => {
  const updatedLayout: GridWidget[] = []

  // remove "add widget" placeholder from layout
  let _layout = layout.filter(
    item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
  )

  // if items already have x/y cords we re-order layout to reflect that
  _layout = _layout.slice().sort((a, b) => {
    if (
      a.x === undefined ||
      b.x === undefined ||
      a.y === undefined ||
      b.y === undefined
    ) {
      return 0
    }

    if (a.y === b.y) {
      return a.x - b.x
    }

    return a.y - b.y
  })

  // re-add placeholder
  if (withAddContentPlaceholder) {
    _layout.push({
      i: 'placeholder',
      type: GRID_WIDGET_TYPE.ADD_CONTENT,
      w: 1,
      h: 1,
      properties: {},
      isResizable: false,
    })
  }

  for (const widget of _layout) {
    placeWidgetInLayout(widget, updatedLayout, gridColumns)
  }

  return updatedLayout
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
    originalW: w < widget.w ? widget.w : undefined,
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
 * Convert grid layout to LSP27 config
 *
 * @param layout
 * @returns
 */
export const layoutToConfig = (layout: GridWidget[]): GridConfigItem[] => {
  // remove "add content" widget from layout before saving
  const layoutWithoutAddContentWidget = layout.filter(
    item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
  )

  // sort by y and then x to get the correct order
  const orderedLayout = layoutWithoutAddContentWidget.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x
    }

    return a.y - b.y
  })

  return orderedLayout.map(item => {
    return {
      type: item.type,
      width: item.originalW || item.w,
      height: item.h,
      properties: item.properties,
    }
  })
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
): Promise<GridWidgetWithoutCords[]> => {
  let config: GridConfigItem[]
  const userConfig = await getGridConfig(address)

  // if user config is invalid we load default one
  if (isConfigValid(userConfig?.config)) {
    config = userConfig?.config as GridConfigItem[]
  } else {
    if (gridLog.enabled) {
      gridLog('Invalid config', userConfig?.config)
    }

    config = defaultConfig(address)
  }

  return configToLayout(config)
}
