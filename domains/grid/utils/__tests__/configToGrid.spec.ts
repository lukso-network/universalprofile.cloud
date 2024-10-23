import { describe, expect, it, vi } from 'vitest'

import { configToGrid } from '../configToGrid'

vi.mock('/domains/grid/utils/generateItemId', () => ({
  generateItemId: () => 'test-id',
}))

describe('configToGrid', () => {
  it('should create unique id for each grid item', () => {
    const config = [
      {
        title: 'default',
        grid: [],
        gridColumns: 2,
      },
      {
        title: 'default',
        grid: [],
        gridColumns: 2,
      },
    ]
    const result = [
      {
        id: 'default',
        title: 'default',
        grid: [],
        gridColumns: 2,
      },
      {
        id: 'default-0',
        title: 'default',
        grid: [],
        gridColumns: 2,
      },
    ]

    expect(configToGrid(config)).toEqual(result)
  })

  it('should return an empty grid for an empty config', () => {
    expect(configToGrid([])).toEqual([])
  })

  it('should correctly handle a single item config', () => {
    const config = [
      {
        title: 'single',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
          },
          {
            type: GRID_WIDGET_TYPE.enum.TEXT,
            width: 1,
            height: 1,
            properties: {
              title: 'Hey',
              text: 'Customize your grid grid!',
              backgroundColor: '#9db9b9',
            },
          },
          {
            type: GRID_WIDGET_TYPE.enum.IMAGE,
            width: 1,
            height: 1,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
          },
        ],
        gridColumns: 2,
      },
    ]
    const result = [
      {
        id: 'single',
        title: 'single',
        grid: [
          {
            type: 'IFRAME',
            properties: {
              src: 'https://via.placeholder.com/150',
            },
            w: 1,
            h: 1,
            i: 'test-id',
          },
          {
            type: 'TEXT',
            properties: {
              title: 'Hey',
              text: 'Customize your grid grid!',
              backgroundColor: '#9db9b9',
            },
            w: 1,
            h: 1,
            i: 'test-id',
          },
          {
            type: 'IMAGE',
            properties: {
              src: 'https://via.placeholder.com/150',
            },
            w: 1,
            h: 1,
            i: 'test-id',
          },
        ],
        gridColumns: 2,
      },
    ]

    expect(configToGrid(config)).toEqual(result)
  })
})
