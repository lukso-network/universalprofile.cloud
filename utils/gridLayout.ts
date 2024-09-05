import {
  type GridLayoutItem,
  type GridWidget,
  GridWidgetType,
  type LSP27TheGrid,
} from '../types/grid'

export function getNewUserLayout(address: string): GridWidget[] {
  return [
    {
      type: GridWidgetType.TITLE_LINK,
      width: 1,
      height: 1,
      properties: { title: address, bgColor: 'bg-purple-58' },
    },
    {
      type: GridWidgetType.TEXT,
      width: 1,
      height: 1,
      properties: {
        title: 'Hey',
        text: 'Customize your grid layout!',
        bgColor: 'bg-sea-salt-67',
      },
    },
    {
      type: GridWidgetType.IMAGE,
      width: 1,
      height: 1,
      properties: { src: 'https://via.placeholder.com/150' },
    },
  ]
}

export function isValidLayout(layout: GridWidget[]): boolean {
  // TODO: We can make the validations even better with Zod or some other library
  if (
    // check if object entries adhere to Widget interface
    !layout.every(item => {
      return (
        typeof item.type === 'string' &&
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

export function toGridLayoutItems(
  grid: LSP27TheGrid,
  gridColumns: number
): GridLayoutItem[] {
  const layout: GridLayoutItem[] = []
  const columnHeights = Array(gridColumns).fill(0) // Track the height of each column

  for (const [i, widget] of grid.entries()) {
    // Find the first position where the widget can fit
    let bestY = Number.MAX_SAFE_INTEGER
    let bestX = 0

    for (let x = 0; x <= gridColumns - widget.width; x++) {
      // Find the max height in the range of columns where this widget would be placed
      const maxY = Math.max(...columnHeights.slice(x, x + widget.width))

      // If this position is better (lower), choose it
      if (maxY < bestY) {
        bestY = maxY
        bestX = x
      }
    }

    // Place the widget in the best position found
    layout.push({
      ...widget,
      i,
      x: bestX,
      y: bestY,
      w: widget.width,
      h: widget.height,
    })

    // Update the column heights based on where the widget was placed
    for (let x = bestX; x < bestX + widget.width; x++) {
      columnHeights[x] = bestY + widget.height
    }
  }

  return layout
}

export function toLSP27TheGrid(layout: GridLayoutItem[]): LSP27TheGrid {
  //Sort by y and then x to get the correct order
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
