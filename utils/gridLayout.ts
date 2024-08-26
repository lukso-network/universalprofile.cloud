import {
  GRID_WIDGET_TYPES_SIZES,
  GridWidgetSize,
  GridWidgetType,
  type GridLayoutItem,
  type GridWidget,
} from '../types/grid'

export const SHOWCASE_LAYOUT: GridWidget[] = [
  {
    position: 1,
    type: GridWidgetType.TITLE_LINK,
    size: GridWidgetSize.MEDIUM,
    properties: {
      title: 'The Grid 🍱',
      bgColor: 'bg-purple-58',
    },
  },
  {
    position: 2,
    type: GridWidgetType.TEXT,
    size: GridWidgetSize.MEDIUM,
    properties: {
      title: 'Welcome to The Grid',
      text: 'You can visit a layout or create your own by visiting /:address. Try /0xcdec110f9c255357e37f46cd2687be1f7e9b02f7',
      bgColor: 'bg-sea-salt-67',
    },
  },
  {
    position: 3,
    type: GridWidgetType.TITLE_LINK,
    size: GridWidgetSize.FULL,
    properties: {
      title: 'LUKSO.NETWORK',
      src: 'https://lukso.network/',
      bgColor: 'bg-lukso-70',
    },
  },
]

export function getNewUserLayout(address: string): GridWidget[] {
  return [
    {
      position: 1,
      type: GridWidgetType.TITLE_LINK,
      size: GridWidgetSize.FULL,
      properties: { title: address, bgColor: 'bg-purple-58' },
    },
    {
      position: 2,
      type: GridWidgetType.TEXT,
      size: GridWidgetSize.MEDIUM,
      properties: {
        title: 'Hey',
        text: 'Customize your grid layout!',
        bgColor: 'bg-sea-salt-67',
      },
    },
    {
      position: 3,
      type: GridWidgetType.IMAGE,
      size: GridWidgetSize.MEDIUM,
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
        typeof item.position === 'number' &&
        typeof item.size === 'number' &&
        typeof item.type === 'string' &&
        typeof item.properties === 'object'
      )
    })
  ) {
    return false
  }

  return true
}

export function toGridLayoutItems(
  widgets: GridWidget[],
  gridColumns = 4
): GridLayoutItem[] {
  const layout: GridLayoutItem[] = []

  // Fill rows and cols with widgets,
  // Depending on size some rows will contain multiple widgets or some empty space
  let y = 0
  let h = 0
  let remainingColumns = gridColumns
  for (const widget of widgets) {
    const size = GRID_WIDGET_TYPES_SIZES[widget.type][widget.size]
    if (!size || !size.w || !size.h) {
      continue
    }

    if (size.w <= remainingColumns) {
      // If widget fits, add it to the current row
      layout.push({
        ...widget,
        i: widget.position,
        x: gridColumns - remainingColumns,
        y: y,
        w: size.w,
        h: size.h,
      })

      // Decrease the remaining columns
      remainingColumns -= size.w

      // h will depend on the height of the tallest widget
      if (h == 0 || h < size.h) {
        h = size.h
      }

      continue
    }

    // If it doesn't fit, go to the next row
    y += h + 1
    // The row height will be the height of the current widget
    h = size.h

    // Add the widget to the next row
    layout.push({
      ...widget,
      i: widget.position,
      x: 0,
      y: y,
      w: size.w,
      h: size.h,
    })

    remainingColumns = gridColumns - size.w
  }

  return layout
}
