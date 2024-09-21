import { describe, expect, it, vi } from 'vitest'
import { configToLayout, layoutToConfig, buildLayout } from '../gridLayout'

type GridTests = {
  grid: GridConfigItem[]
  expectedLayouts: Record<number, Partial<GridWidget>[]>
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
        type: GRID_WIDGET_TYPE.TITLE_LINK,
        width: 1,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        width: 1,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      1: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 3,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 5,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      2: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 1,
          y: 1,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      3: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.TITLE_LINK,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 1,
          y: 0,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 2,
          y: 0,
          w: 1,
          h: 2,
          type: GRID_WIDGET_TYPE.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 1,
          y: 1,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
  {
    grid: [
      {
        type: GRID_WIDGET_TYPE.IMAGE,
        width: 2,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      1: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 3,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      2: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 2,
          h: 2,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 2,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 1,
          y: 2,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
  {
    grid: [
      {
        type: GRID_WIDGET_TYPE.IMAGE,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.IFRAME,
        width: 2,
        height: 2,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.TEXT,
        width: 1,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
      {
        type: GRID_WIDGET_TYPE.IMAGE,
        width: 2,
        height: 1,
        properties: { prop1: 'value1', prop2: 'value2' },
      },
    ],
    expectedLayouts: {
      2: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 1,
          w: 2,
          h: 2,
          type: GRID_WIDGET_TYPE.IFRAME,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 3,
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.TEXT,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
        {
          i: 'test-id',
          x: 0,
          y: 4,
          w: 2,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
    },
  },
]

vi.mock('/domains/grid/utils/generateItemId', () => ({
  generateItemId: () => 'test-id',
}))

describe('Grid Layout Handling', () => {
  describe('configToLayout', () => {
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
          const gridItems = buildLayout(configToLayout(grid), gridColumns)
          expect(gridItems).toMatchObject(expectedLayout)
        }
      )
    })
  })

  describe('Transformation invariance', () => {
    describe('Grid config to layout and back should produce the original object', () => {
      it.each([
        { case: 0, gridColumns: 2, grid: GRID_TESTS[0].grid },
        { case: 1, gridColumns: 2, grid: GRID_TESTS[1].grid },
        { case: 2, gridColumns: 2, grid: GRID_TESTS[2].grid },
        { case: 3, gridColumns: 2, grid: GRID_TESTS[3].grid },
      ])('case=$case gridColumns=$gridColumns ', ({ gridColumns, grid }) => {
        const gridItems = buildLayout(configToLayout(grid), gridColumns)
        const gridItemsBack = layoutToConfig(gridItems)
        expect(gridItemsBack).toEqual(grid)
      })
    })

    describe('Grid layout to config and back should produce the same original layout', () => {
      it.each([
        { case: 0, gridColumns: 2, grid: GRID_TESTS[0].grid },
        { case: 1, gridColumns: 2, grid: GRID_TESTS[1].grid },
        { case: 2, gridColumns: 2, grid: GRID_TESTS[2].grid },
        { case: 3, gridColumns: 2, grid: GRID_TESTS[3].grid },
      ])('case=$case gridColumns=$gridColumns', ({ gridColumns, grid }) => {
        const gridItems = buildLayout(configToLayout(grid), gridColumns)
        const gridFromLayout = layoutToConfig(gridItems)
        const gridLayoutItemsBack = buildLayout(
          configToLayout(gridFromLayout),
          gridColumns
        )
        expect(gridLayoutItemsBack).toEqual(gridItems)
      })
    })
  })
})
