import { describe, expect, it } from 'vitest'
import { compareGrids } from '../compareGrids'

describe('compareGrids', () => {
  it('should return no changes for identical grids', () => {
    const gridA: Grid<GridWidget>[] = [
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
            type: GRID_WIDGET_TYPE.IFRAME,
            properties: {},
          },
        ],
      },
    ]
    const gridB: Grid<GridWidget>[] = [
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
            type: GRID_WIDGET_TYPE.IFRAME,
            properties: {},
          },
        ],
      },
    ]

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([])
  })

  it('should return changes for grids with different titles', () => {
    const gridA: Grid<GridWidget>[] = [
      { id: 'grid-1', title: 'Grid 1', grid: [] },
    ]
    const gridB: Grid<GridWidget>[] = [
      { id: 'grid-2', title: 'Grid 2', grid: [] },
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
    const gridA: Grid<GridWidget>[] = [
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
            type: GRID_WIDGET_TYPE.IFRAME,
            properties: {},
          },
        ],
      },
    ]
    const gridB: Grid<GridWidget>[] = [
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
            type: GRID_WIDGET_TYPE.IMAGE,
            properties: {},
          },
        ],
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
    const gridA: Grid<GridWidget>[] = []
    const gridB: Grid<GridWidget>[] = [
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
            type: GRID_WIDGET_TYPE.IFRAME,
            properties: {},
          },
        ],
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
    const gridA: Grid<GridWidget>[] = []
    const gridB: Grid<GridWidget>[] = []

    const result = compareGrids(gridA, gridB)
    expect(result).toEqual([])
  })
})
