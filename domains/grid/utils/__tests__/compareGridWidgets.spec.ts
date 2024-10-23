import { describe, expect, it } from 'vitest'
import { compareGridWidgets } from '../compareGridWidgets'

describe('compareGridWidgets', () => {
  it('returns empty array when both grids are the same', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([])
    expect(compareGridWidgets([], [])).toEqual([])
  })

  it('returns array of changes when widgets change positions', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: gridB[0],
      },
    ])
  })

  it('returns array of changes when widgets change sizes', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 2,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: gridB[0],
      },
    ])
  })

  it('returns array of changes when widgets change types', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IMAGE,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: gridB[0],
      },
    ])
  })

  it('returns array of changes when widgets change properties', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.org',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: gridB[0],
      },
    ])
  })

  it('returns array of changes when widgets are added', () => {
    const gridA = [] as GridWidget[]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: null,
        newWidget: gridB[0],
      },
    ])
  })

  it('returns array of changes when widgets are removed', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const gridB = [] as GridWidget[]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: null,
      },
    ])
  })

  it('returns array of changes when multiple widgets change', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
      {
        i: 'widget-2',
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IMAGE,
        properties: {
          src: 'https://example.org/image.png',
        },
      },
      {
        i: 'widget-3',
        x: 0,
        y: 1,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IMAGE,
        properties: {
          src: 'https://example.org/image.png',
        },
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IMAGE,
        properties: {
          src: 'https://example.org',
        },
      },
      {
        i: 'widget-2',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
      {
        i: 'widget-3',
        x: 0,
        y: 1,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IMAGE,
        properties: {
          src: 'https://example.org/image.png',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([
      {
        oldWidget: gridA[0],
        newWidget: gridB[0],
      },
      {
        oldWidget: gridA[1],
        newWidget: gridB[1],
      },
    ])
  })

  it('ignores ADD_CONTENT widgets', () => {
    const gridA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
      {
        i: 'placeholder',
        x: 0,
        y: 1,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.ADD_CONTENT,
        properties: {},
      },
    ]
    const gridB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.enum.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareGridWidgets(gridA, gridB)).toEqual([])
  })
})
