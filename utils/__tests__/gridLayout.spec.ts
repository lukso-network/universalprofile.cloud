import { describe, expect, it } from 'vitest'
import { toGridLayoutItems, toLSP27TheGrid } from '../gridLayout'

interface GridTests {
  grid: LSP27TheGrid
  expectedLayouts: Record<number, Partial<GridLayoutItem>[]>
}

const GRID_TESTS: GridTests[] = [
  {
    grid: [],
    expectedLayouts: {
      1: [],
      2: [],
    },
  },
  {
    grid: [
      {
        type: GridWidgetType.TITLE_LINK,
        width: 1,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.IFRAME,
        width: 1,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      1: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GridWidgetType.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 0,
          y: 3,
          w: 1,
          h: 2,
          type: GridWidgetType.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 3,
          x: 0,
          y: 5,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      2: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GridWidgetType.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 1,
          y: 1,
          w: 1,
          h: 2,
          type: GridWidgetType.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 3,
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      3: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GridWidgetType.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 2,
          y: 0,
          w: 1,
          h: 2,
          type: GridWidgetType.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 3,
          x: 1,
          y: 1,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
  {
    grid: [
      {
        type: GridWidgetType.IMAGE,
        width: 2,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      1: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 0,
          y: 3,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      2: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 1,
          y: 2,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
  {
    grid: [
      {
        type: GridWidgetType.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.IFRAME,
        width: 2,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GridWidgetType.IMAGE,
        width: 2,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      2: [
        {
          i: 0,
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 1,
          x: 0,
          y: 1,
          w: 2,
          h: 2,
          type: GridWidgetType.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 2,
          x: 0,
          y: 3,
          w: 1,
          h: 1,
          type: GridWidgetType.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 3,
          x: 0,
          y: 4,
          w: 2,
          h: 1,
          type: GridWidgetType.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
]

describe('Grid Layout Handling', () => {
  describe('toGridLayoutItems', () => {
    describe('should position elements correctly', () => {
      it.each([
        {
          case: 0,
          gridColumns: 1,
          grid: GRID_TESTS[0].grid,
          expectedLayout: GRID_TESTS[0].expectedLayouts[1],
        },
        {
          case: 0,
          gridColumns: 2,
          grid: GRID_TESTS[0].grid,
          expectedLayout: GRID_TESTS[0].expectedLayouts[2],
        },
        {
          case: 1,
          gridColumns: 1,
          grid: GRID_TESTS[1].grid,
          expectedLayout: GRID_TESTS[1].expectedLayouts[1],
        },
        {
          case: 1,
          gridColumns: 2,
          grid: GRID_TESTS[1].grid,
          expectedLayout: GRID_TESTS[1].expectedLayouts[2],
        },
        {
          case: 1,
          gridColumns: 3,
          grid: GRID_TESTS[1].grid,
          expectedLayout: GRID_TESTS[1].expectedLayouts[3],
        },
        {
          case: 2,
          gridColumns: 2,
          grid: GRID_TESTS[2].grid,
          expectedLayout: GRID_TESTS[2].expectedLayouts[2],
        },
        {
          case: 3,
          gridColumns: 2,
          grid: GRID_TESTS[3].grid,
          expectedLayout: GRID_TESTS[3].expectedLayouts[2],
        },
      ])(
        'case=$case gridColumns=$gridColumns',
        ({ gridColumns, grid, expectedLayout }) => {
          const gridItems = toGridLayoutItems(grid, gridColumns)
          expect(gridItems).toMatchObject(expectedLayout)
        }
      )
    })
  })

  describe('Transformation invariance', () => {
    describe('LSP27TheGrid to GridLayoutItem and back should produce the original object', () => {
      it.each([
        { case: 0, gridColumns: 2, grid: GRID_TESTS[0].grid },
        { case: 1, gridColumns: 2, grid: GRID_TESTS[1].grid },
        { case: 2, gridColumns: 2, grid: GRID_TESTS[2].grid },
        { case: 3, gridColumns: 2, grid: GRID_TESTS[3].grid },
      ])('case=$case gridColumns=$gridColumns ', ({ gridColumns, grid }) => {
        const gridItems = toGridLayoutItems(grid, gridColumns)
        const gridItemsBack = toLSP27TheGrid(gridItems)
        expect(gridItemsBack).toEqual(grid)
      })
    })

    describe('GridLayoutItem to LSP27TheGrid and back should produce the same original layout', () => {
      it.each([
        { case: 0, gridColumns: 2, grid: GRID_TESTS[0].grid },
        { case: 1, gridColumns: 2, grid: GRID_TESTS[1].grid },
        { case: 2, gridColumns: 2, grid: GRID_TESTS[2].grid },
        { case: 3, gridColumns: 2, grid: GRID_TESTS[3].grid },
      ])('case=$case gridColumns=$gridColumns', ({ gridColumns, grid }) => {
        const gridItems = toGridLayoutItems(grid, gridColumns)
        const gridFromLayout = toLSP27TheGrid(gridItems)
        const gridLayoutItemsBack = toGridLayoutItems(
          gridFromLayout,
          gridColumns
        )
        expect(gridLayoutItemsBack).toEqual(gridItems)
      })
    })
  })
})
