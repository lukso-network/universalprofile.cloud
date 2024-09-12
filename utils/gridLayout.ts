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
        item.type in GridWidgetType &&
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
  const columnHeights = Array(gridColumns).fill(0)

  if (gridColumns === 1) {
    // Simple stacking for single column layout
    let currentY = 0
    for (const [i, widget] of grid.entries()) {
      layout.push(placeWidgetInSingleColumn(widget, i, currentY))
      currentY += widget.height
    }
  } else {
    // General case for multiple columns
    for (const [i, widget] of grid.entries()) {
      const { x, y } = findBestPosition(widget, columnHeights, gridColumns)
      layout.push(placeWidgetInLayout(widget, i, x, y))
      updateColumnHeights(columnHeights, x, widget.width, y + widget.height)
    }
  }

  return layout
}

export function addGridLayoutItem(
  layout: GridLayoutItem[],
  newWidget: GridWidget,
  gridColumns: number
): GridLayoutItem[] {
  const columnHeights = getColumnHeightsFromLayout(layout, gridColumns)

  if (gridColumns === 1) {
    // Place the widget in a single column at the end
    const currentY = Math.max(...columnHeights)
    const newIndex = layout.length
    layout.push(placeWidgetInSingleColumn(newWidget, newIndex, currentY))
  } else {
    // Place the widget in the best position in multiple columns
    const { x, y } = findBestPosition(newWidget, columnHeights, gridColumns)
    const newIndex = layout.length
    layout.push(placeWidgetInLayout(newWidget, newIndex, x, y))
    updateColumnHeights(columnHeights, x, newWidget.width, y + newWidget.height)
  }

  return layout
}

function findBestPosition(
  widget: GridWidget,
  columnHeights: number[],
  gridColumns: number
): { x: number; y: number } {
  let bestY = Number.MAX_SAFE_INTEGER
  let bestX = 0

  for (let x = 0; x <= gridColumns - widget.width; x++) {
    const maxY = Math.max(...columnHeights.slice(x, x + widget.width))
    if (maxY < bestY) {
      bestY = maxY
      bestX = x
    }
  }

  return { x: bestX, y: bestY }
}

function placeWidgetInLayout(
  widget: GridWidget,
  i: number,
  x: number,
  y: number
): GridLayoutItem {
  return {
    ...widget,
    i,
    x,
    y,
    w: widget.width,
    h: widget.height,
  }
}

function placeWidgetInSingleColumn(
  widget: GridWidget,
  i: number,
  y: number
): GridLayoutItem {
  return {
    ...widget,
    i,
    x: 0,
    y,
    w: 1,
    h: widget.height,
  }
}

function updateColumnHeights(
  columnHeights: number[],
  x: number,
  width: number,
  newHeight: number
): void {
  for (let i = x; i < x + width; i++) {
    columnHeights[i] = newHeight
  }
}

function getColumnHeightsFromLayout(
  layout: GridLayoutItem[],
  gridColumns: number
): number[] {
  const columnHeights = Array(gridColumns).fill(0)

  for (const item of layout) {
    for (let x = item.x; x < item.x + item.w; x++) {
      columnHeights[x] = Math.max(columnHeights[x], item.y + item.h)
    }
  }

  return columnHeights
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
