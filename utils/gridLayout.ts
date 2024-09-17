import { v4 as uuidv4 } from 'uuid'

import {
  type GridLayoutItem,
  type GridWidget,
  GridWidgetType,
  type LSP27TheGrid,
} from '../types/grid'

export const getDefaultLayout = (address: string): GridWidget[] => {
  return [
    {
      type: GridWidgetType.TITLE_LINK,
      width: 1,
      height: 1,
      properties: { title: address, bgColor: 'bg-purple-58' },
      id: uuidv4(),
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
      id: uuidv4(),
    },
    {
      type: GridWidgetType.IMAGE,
      width: 1,
      height: 1,
      properties: { src: 'https://via.placeholder.com/150' },
      id: uuidv4(),
    },
  ]
}

export const isValidLayout = (layout: GridWidget[]): boolean => {
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

export const toGridLayoutItems = (
  grid: LSP27TheGrid,
  gridColumns: number
): GridLayoutItem[] => {
  let layout: GridLayoutItem[] = []

  if (gridColumns === 1) {
    // Simple stacking for single column layout
    let currentY = 0
    for (const [i, widget] of grid.entries()) {
      layout.push({
        ...widget,
        i,
        x: 0,
        y: currentY,
        w: 1,
        h: widget.height,
      })
      currentY += widget.height
    }
  } else {
    // General case for multiple columns
    const columnHeights = Array(gridColumns).fill(0)

    for (const [i, widget] of grid.entries()) {
      let bestY = Number.MAX_SAFE_INTEGER
      let bestX = 0

      for (let x = 0; x <= gridColumns - widget.width; x++) {
        const maxY = Math.max(...columnHeights.slice(x, x + widget.width))

        if (maxY < bestY) {
          bestY = maxY
          bestX = x
        }
      }

      layout.push({
        ...widget,
        i,
        x: bestX,
        y: bestY,
        w: widget.width,
        h: widget.height,
      })

      for (let x = bestX; x < bestX + widget.width; x++) {
        columnHeights[x] = bestY + widget.height
      }
    }
  }

  // add id's for items
  layout = layout.map(item => {
    return {
      ...item,
      id: item.id || uuidv4(),
    }
  })

  return layout
}

export const toLSP27TheGrid = (layout: GridLayoutItem[]): LSP27TheGrid => {
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
      id: item.id,
    }
  })
}
