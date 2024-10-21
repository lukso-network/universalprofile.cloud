import { e } from 'pinia-orm/dist/shared/pinia-orm.ed84a779'
import { describe, expect, it } from 'vitest'
import { buildGrid } from '../buildGrid'

describe('buildGrid', () => {
  it('should return an empty grid when given an empty grid', () => {
    const grid: Grid<GridWidgetWithoutCords>[] = []
    const result = buildGrid(grid)
    expect(result).toEqual([])
  })

  it('should re-order grid based on x/y cords', () => {
    const grid: Grid<GridWidgetWithoutCords>[] = [
      {
        id: '1',
        title: 'Test Grid',
        grid: [
          {
            i: '1',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 1,
            y: 0,
          },
          {
            i: '2',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 0,
            y: 0,
          },
          {
            i: '3',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 0,
            y: 1,
          },
        ],
        gridColumns: 1,
      },
    ]
    const result = buildGrid(grid)
    expect(result).toEqual([
      {
        id: '1',
        title: 'Test Grid',
        grid: [
          {
            i: '2',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 0,
            y: 0,
          },
          {
            i: '1',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 0,
            y: 1,
          },
          {
            i: '3',
            type: GRID_WIDGET_TYPE.IFRAME,
            w: 1,
            h: 1,
            properties: {},
            x: 0,
            y: 2,
          },
        ],
        gridColumns: 1,
      },
    ])
  })

  describe('withAddContentPlaceholder', () => {
    it('should remove "add content" placeholder from grid', () => {
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 1,
              x: 0,
              y: 0,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.ADD_CONTENT,
              w: 1,
              h: 1,
              x: 0,
              y: 1,
              properties: {},
            },
          ],
          gridColumns: 1,
        },
      ]
      const result = buildGrid(grid)
      expect(result).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 1,
              x: 0,
              y: 0,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ])
    })

    it('should add placeholder', () => {
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 1,
              x: 0,
              y: 0,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ]
      const result = buildGrid(grid, undefined, true)
      expect(result).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 1,
              x: 0,
              y: 0,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: 'placeholder',
              type: GRID_WIDGET_TYPE.ADD_CONTENT,
              w: 1,
              h: 1,
              x: 0,
              y: 1,
              properties: {},
              isResizable: false,
            },
          ],
          gridColumns: 1,
        },
      ])
    })
  })

  describe('grid 1', () => {
    it('should build 1 column grid', () => {
      /*
      Column 0
      ---------
      |   A   |  <-- height 2
      |       |
      |   B   |  <-- height 1
      |   C   |  <-- height 2
      |       |
      |   D   |  <-- height 1
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 0,
              y: 2,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 0,
              y: 3,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.IFRAME,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              x: 0,
              y: 5,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ])
    })

    it('should build 2 column grid', () => {
      /*
      Column 0     Column 1
      ----------------------
      |   A   |    |   B   |  <-- A: height 2, B: height 1
      |       |    |-------|
      |-------|    |   C   |  <-- C: height 2
      |   D   |    |       |  <-- D: height 1
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 1,
              y: 0,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 1,
              y: 1,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.IFRAME,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              x: 0,
              y: 2,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ])
    })

    it('should build 3 column grid', () => {
      /*
      Column 0     Column 1     Column 2
      -----------------------------------
      |   A   |    |   B   |    |   C   |  <-- A: height 2, B: height 1, C: height 2
      |       |    |-------|    |       |
      |-------|    |   D   |    |-------|
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 1,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 3,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.TITLE_LINK,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 1,
              y: 0,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 2,
              y: 0,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.IFRAME,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              x: 1,
              y: 1,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 3,
        },
      ])
    })
  })

  describe('grid 2', () => {
    it('should build 1 column grid', () => {
      /*
      Column 0
      ---------
      |   A   |  <-- height 2
      |       |
      |-------|
      |   B   |  <-- height 1
      |-------|
      |   C   |  <-- height 1
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 2,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
              originalWidth: 2,
            },
            {
              i: '2',
              x: 0,
              y: 2,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 0,
              y: 3,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ])
    })

    it('should build 2 column grid', () => {
      /*
      Column 0     Column 1
      ----------------------
      |   A   |    |   A   |  <-- height 2 (width spans 2 columns)
      |-------|    |-------|
      |   B   |    |   C   |  <-- height 1 each
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 2,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 2,
              h: 2,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 0,
              y: 2,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 1,
              y: 2,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ])
    })
  })

  describe('grid 3', () => {
    it('should build 1 column grid', () => {
      /*
      Column 0
      ---------
      |   A   |  <-- height 1
      |-------|
      |   B   |  <-- height 2
      |   B   |
      |-------|
      |   C   |  <-- height 1
      |-------|
      |   D   |  <-- height 1
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 2,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 2,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 1,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 0,
              y: 1,
              w: 1,
              h: 2,
              type: GRID_WIDGET_TYPE.IFRAME,
              properties: { prop1: 'value1', prop2: 'value2' },
              originalWidth: 2,
            },
            {
              i: '3',
              x: 0,
              y: 3,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              x: 0,
              y: 4,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
              originalWidth: 2,
            },
          ],
          gridColumns: 1,
        },
      ])
    })

    it('should build 2 column grid', () => {
      /*
      Column 0     Column 1
      ----------------------
      |   A   |             |  <-- height 1
      |-------|             |
      |   B   |     B       |  <-- height 2 (width spans 2 columns)
      |-------|-------------|
      |   C   |             |  <-- height 1
      |-------|-------------|
      |   D   |     D       |  <-- height 1 (width spans 2 columns)
      */
      const grid: Grid<GridWidgetWithoutCords>[] = [
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              type: GRID_WIDGET_TYPE.IFRAME,
              w: 2,
              h: 2,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              type: GRID_WIDGET_TYPE.TEXT,
              w: 1,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              type: GRID_WIDGET_TYPE.IMAGE,
              w: 2,
              h: 1,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ]

      expect(buildGrid(grid)).toEqual([
        {
          id: '1',
          title: 'Test Grid',
          grid: [
            {
              i: '1',
              x: 0,
              y: 0,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '2',
              x: 0,
              y: 1,
              w: 2,
              h: 2,
              type: GRID_WIDGET_TYPE.IFRAME,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '3',
              x: 0,
              y: 3,
              w: 1,
              h: 1,
              type: GRID_WIDGET_TYPE.TEXT,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
            {
              i: '4',
              x: 0,
              y: 4,
              w: 2,
              h: 1,
              type: GRID_WIDGET_TYPE.IMAGE,
              properties: { prop1: 'value1', prop2: 'value2' },
            },
          ],
          gridColumns: 2,
        },
      ])
    })
  })
})
