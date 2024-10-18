import { describe, expect, it } from 'vitest'
import { compareLayouts } from '../compareLayouts'

describe('compareLayouts', () => {
  it('returns empty array when both layouts are the same', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([])
    expect(compareLayouts([], [])).toEqual([])
  })

  it('returns array of changes when widgets change positions', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: layoutB[0],
      },
    ])
  })

  it('returns array of changes when widgets change sizes', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 2,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: layoutB[0],
      },
    ])
  })

  it('returns array of changes when widgets change types', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IMAGE,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: layoutB[0],
      },
    ])
  })

  it('returns array of changes when widgets change properties', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.org',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: layoutB[0],
      },
    ])
  })

  it('returns array of changes when widgets are added', () => {
    const layoutA = [] as GridWidget[]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: null,
        newWidget: layoutB[0],
      },
    ])
  })

  it('returns array of changes when widgets are removed', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]
    const layoutB = [] as GridWidget[]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: null,
      },
    ])
  })

  it('returns array of changes when multiple widgets change', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
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
        type: GRID_WIDGET_TYPE.IMAGE,
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
        type: GRID_WIDGET_TYPE.IMAGE,
        properties: {
          src: 'https://example.org/image.png',
        },
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 1,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IMAGE,
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
        type: GRID_WIDGET_TYPE.IFRAME,
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
        type: GRID_WIDGET_TYPE.IMAGE,
        properties: {
          src: 'https://example.org/image.png',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([
      {
        oldWidget: layoutA[0],
        newWidget: layoutB[0],
      },
      {
        oldWidget: layoutA[1],
        newWidget: layoutB[1],
      },
    ])
  })

  it('ignores ADD_CONTENT widgets', () => {
    const layoutA = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
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
        type: GRID_WIDGET_TYPE.ADD_CONTENT,
        properties: {},
      },
    ]
    const layoutB = [
      {
        i: 'widget-1',
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        type: GRID_WIDGET_TYPE.IFRAME,
        properties: {
          src: 'https://example.com',
        },
      },
    ]

    expect(compareLayouts(layoutA, layoutB)).toEqual([])
  })
})
