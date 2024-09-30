import { describe, expect, it, vi } from 'vitest'
import { buildLayout, configToLayout, layoutToConfig } from '../gridLayout'

type GridTest = {
  grid: GridConfigItem[]
  expectedLayouts: Record<number, Partial<GridWidget>[]>
}

const GRID_TESTS: GridTest[] = [
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
      /*
      Column 0     Column 1
      ----------------------
      |   A   |    |   B   |  <-- A: height 2, B: height 1
      |       |    |-------|
      |-------|    |   C   |  <-- C: height 2
      |   D   |    |       |  <-- D: height 1
      */
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
      /*
      Column 0     Column 1     Column 2
      -----------------------------------
      |   A   |    |   B   |    |   C   |  <-- A: height 2, B: height 1, C: height 2
      |       |    |-------|    |       |
      |-------|    |   D   |    |-------|
      */
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
      1: [
        {
          i: 'test-id',
          x: 0,
          y: 0,
          w: 1,
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
      /*
      Column 0     Column 1
      ----------------------
      |   A   |    |   A   |  <-- height 2 (width spans 2 columns)
      |-------|    |-------|
      |   B   |    |   C   |  <-- height 1 each
      */
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
      1: [
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
          w: 1,
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
          w: 1,
          h: 1,
          type: GRID_WIDGET_TYPE.IMAGE,
          properties: { prop1: 'value1', prop2: 'value2' },
        },
      ],
      2: [
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
  describe('should build layout correctly and produce same config', () => {
    it.each(
      GRID_TESTS.flatMap(({ grid, expectedLayouts }, index) =>
        Object.entries(expectedLayouts).map(
          ([gridColumns, expectedLayout]) => ({
            case: index,
            gridColumns: Number(gridColumns),
            grid,
            expectedLayout,
          })
        )
      )
    )(
      'case=$case gridColumns=$gridColumns',
      ({ case: caseIndex, gridColumns, grid, expectedLayout }) => {
        const builtLayout = buildLayout(configToLayout(grid), gridColumns)
        expect(builtLayout).toMatchObject(expectedLayout)

        const config = layoutToConfig(builtLayout)
        expect(config).toEqual(grid)
      }
    )
  })
})
