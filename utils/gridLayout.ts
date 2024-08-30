import { type Widget, WidgetSize, WidgetType } from '../types/grid'

export const SHOWCASE_LAYOUT: Widget[] = [
  {
    i: '0',
    x: 0,
    y: 0,
    w: WidgetSize.SMALL,
    h: 6,
    type: WidgetType.TITLE_LINK,
    properties: {
      title: 'The Grid 🍱',
      bgColor: 'bg-purple-58',
    },
  },
  {
    i: '1',
    x: 1,
    y: 0,
    w: WidgetSize.MEDIUM,
    h: 10,
    type: WidgetType.TEXT,
    properties: {
      title: 'Welcome to The Grid',
      text: 'You can visit a layout or create your own by visiting /:username. Try /feindura or /irontom.',
      bgColor: 'bg-sea-salt-67',
    },
  },
  {
    i: '2',
    x: 0,
    y: 10,
    w: WidgetSize.FULL,
    h: 5,
    type: WidgetType.TITLE_LINK,
    properties: {
      title: 'LUKSO.NETWORK',
      src: 'https://lukso.network/',
      bgColor: 'bg-lukso-70',
    },
  },
]

export function getNewUserLayout(address: string): Widget[] {
  return [
    {
      i: '1',
      x: 0,
      y: 0,
      w: 2,
      h: 6,
      type: WidgetType.TITLE_LINK,
      properties: { title: address, bgColor: 'bg-purple-58' },
    },
    {
      i: '2',
      x: 2,
      y: 1,
      w: 2,
      h: 6,
      type: WidgetType.TEXT,
      properties: { title: 'Text', text: 'Text', bgColor: 'bg-sea-salt-67' },
    },
    {
      i: '3',
      x: 0,
      y: 2,
      w: 1,
      h: 7,
      type: WidgetType.IMAGE,
      properties: { src: 'https://via.placeholder.com/150' },
    },
  ]
}

export function isValidLayout(layout: Widget[]): boolean {
  // We can make the validations even better with Zod or some other library
  if (
    !Array.isArray(layout) ||
    // check if object entries adhere to Widget interface
    !layout.every(item => {
      return (
        typeof item.x === 'number' &&
        typeof item.y === 'number' &&
        typeof item.w === 'number' &&
        typeof item.h === 'number' &&
        typeof item.type === 'string' &&
        typeof item.properties === 'object'
      )
    })
  ) {
    return false
  }

  return true
}
