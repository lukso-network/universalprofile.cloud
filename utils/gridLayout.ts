import {
  GridWidgetType,
  type GridLayoutItem,
  type GridWidget,
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
  // We can make the validations even better with Zod or some other library

  console.log(JSON.stringify(layout))

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
  gridColumns = 4
): GridLayoutItem[] {
  const layout: GridLayoutItem[] = []

  // Fill rows and cols with widgets,
  // Depending on size some rows will contain multiple widgets or some empty space
  let y = 0
  let h = 0
  let remainingColumns = gridColumns
  for (const [i, widget] of grid.entries()) {
    if (widget.width <= remainingColumns) {
      // If widget fits, add it to the current row
      layout.push({
        ...widget,
        i,
        x: gridColumns - remainingColumns,
        y: y,
        w: widget.width,
        h: widget.height,
      })

      // Decrease the remaining columns
      remainingColumns -= widget.width

      // h will depend on the height of the tallest widget
      if (h == 0 || h < widget.height) {
        h = widget.height
      }

      continue
    }

    // If it doesn't fit, go to the next row
    y += h + 1
    // The row height will be the height of the current widget
    h = widget.height

    // Add the widget to the next row
    layout.push({
      ...widget,
      i,
      x: 0,
      y: y,
      w: widget.width,
      h: widget.height,
    })

    remainingColumns = gridColumns - widget.width
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

  return orderedLayout.map((item) => {
    return {
      type: item.type,
      width: item.w,
      height: item.h,
      properties: item.properties,
    }
  })
}
