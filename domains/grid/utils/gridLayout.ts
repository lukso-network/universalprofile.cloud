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
      properties: { title: address, bgColor: 'bg-purple-58' },
    },
    {
      type: GRID_WIDGET_TYPE.TEXT,
      width: 1,
      height: 1,
      properties: {
        title: 'Hey',
        text: 'Customize your grid layout!',
        bgColor: 'bg-sea-salt-67',
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
  config: GridConfigItem[],
  columns: number
): GridWidget[] => {
  const layout = config.map(item => {
    return {
      type: item.type,
      properties: item.properties,
      w: item.width,
      h: item.height,
      i: generateItemId(),
    } as GridWidgetWithoutCords
  })

  return buildLayout(layout, columns)
}

export const buildLayout = (
  layout: GridWidgetWithoutCords[],
  gridColumns: number
): GridWidget[] => {
  const columnHeights = Array(gridColumns).fill(0)
  const updatedLayout: GridWidget[] = []

  if (gridColumns === 1) {
    // Simple stacking for single column layout
    let currentY = 0

    for (const widget of layout) {
      updatedLayout.push(placeWidgetInSingleColumn(widget, currentY))
      currentY += widget.h
    }
  } else {
    // General case for multiple columns
    for (const widget of layout) {
      const { x, y } = findBestPosition(widget, columnHeights, gridColumns)
      updatedLayout.push(placeWidgetInLayout(widget, x, y))
      updateColumnHeights(columnHeights, x, widget.w, y + widget.h)
    }
  }

  return updatedLayout
}

export const findBestPosition = (
  widget: GridWidgetWithoutCords,
  columnHeights: number[],
  gridColumns: number
): { x: number; y: number } => {
  let bestY = Number.MAX_SAFE_INTEGER
  let bestX = 0

  for (let x = 0; x <= gridColumns - widget.w; x++) {
    const maxY = Math.max(...columnHeights.slice(x, x + widget.w))
    if (maxY < bestY) {
      bestY = maxY
      bestX = x
    }
  }

  return { x: bestX, y: bestY }
}

export const placeWidgetInLayout = (
  widget: GridWidgetWithoutCords,
  x: number,
  y: number
): GridWidget => {
  return {
    ...widget,
    x,
    y,
  }
}

export const placeWidgetInSingleColumn = (
  widget: GridWidgetWithoutCords,
  y: number
): GridWidget => {
  return {
    ...widget,
    x: 0,
    y,
    w: 1,
  }
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

  for (const item of layout) {
    for (let x = item.x; x < item.x + item.w; x++) {
      columnHeights[x] = Math.max(columnHeights[x], item.y + item.h)
    }
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
  // sort by y and then x to get the correct order
  const orderedLayout = layout.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x
    }

    return a.y - b.y
  })

  return orderedLayout.map(item => {
    return {
      type: item.type,
      width: item.w,
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
export const getGridLayout = async (address: Address, columns: number) => {
  let config: GridConfigItem[]
  const gridConfigObject = await getGridConfig(address)

  // if user config is invalid we load default one
  if (!isConfigValid(gridConfigObject?.config)) {
    config = defaultConfig(address)
  } else {
    config = gridConfigObject?.config as GridConfigItem[]
  }

  return configToLayout(config, columns)
}
