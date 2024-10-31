import { describe, expect, it } from 'vitest'

import { compareGrids } from '../compareGrids'

describe('compareGrids', () => {
  it('should return no changes for identical grids', () => {
    const gridA: Grid[] = [
      {
        id: 'grid-1',
        title: 'Grid 1',
        grid: [
          {
            i: 'widget1',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            properties: {},
          },
        ],
        gridColumns: 2,
      },
    ]
    const gridB: Grid[] = [
      {
        id: 'grid-1',
        title: 'Grid 1',
        grid: [
          {
            i: 'widget1',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            properties: {},
          },
        ],
        gridColumns: 2,
      },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([])
  })

  it('should return changes for grids with different titles', () => {
    const gridA: Grid[] = [
      { id: 'grid-1', title: 'Grid 1', grid: [], gridColumns: 2 },
    ]
    const gridB: Grid[] = [
      { id: 'grid-2', title: 'Grid 2', grid: [], gridColumns: 2 },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([
      {
        oldGrid: gridA[0],
        newGrid: gridB[0],
      },
    ])
  })

  it('should return changes for grids with different column numbers', () => {
    const gridA: Grid[] = [
      { id: 'grid-1', title: 'Grid 1', grid: [], gridColumns: 2 },
    ]
    const gridB: Grid[] = [
      { id: 'grid-1', title: 'Grid 1', grid: [], gridColumns: 3 },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([
      {
        oldGrid: gridA[0],
        newGrid: gridB[0],
      },
    ])
  })

  it('should return changes for grids with different widgets', () => {
    const gridA: Grid[] = [
      {
        id: 'grid-1',
        title: 'Grid 1',
        grid: [
          {
            i: 'widget1',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            properties: {},
          },
        ],
        gridColumns: 2,
      },
    ]
    const gridB: Grid[] = [
      {
        id: 'grid-3',
        title: 'Grid 1',
        grid: [
          {
            i: 'widget1',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            type: GRID_WIDGET_TYPE.enum.IMAGE,
            properties: {},
          },
        ],
        gridColumns: 2,
      },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([
      {
        oldGrid: gridA[0],
        newGrid: gridB[0],
      },
    ])
  })

  it('should return changes when one grid is empty and the other is not', () => {
    const gridA: Grid[] = []
    const gridB: Grid[] = [
      {
        id: 'grid-1',
        title: 'Grid 1',
        grid: [
          {
            i: 'widget1',
            x: 0,
            y: 0,
            w: 1,
            h: 1,
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            properties: {},
          },
        ],
        gridColumns: 2,
      },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([
      {
        oldGrid: undefined,
        newGrid: gridB[0],
      },
    ])
  })

  it('should return no changes for two empty grids', () => {
    const gridA: Grid[] = []
    const gridB: Grid[] = []

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([])
  })
})
