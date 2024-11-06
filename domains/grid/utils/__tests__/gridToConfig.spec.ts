import { describe, expect, it } from 'vitest'

import { gridToConfig } from '../gridToConfig'

describe('gridToConfig', () => {
  it('should return an empty config for an empty grid', () => {
    expect(gridToConfig([])).toEqual([])
  })

  it('should correctly handle a single item grid', () => {
    const grid = [
      {
        id: 'single',
        title: 'single',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
            w: 1,
            h: 1,
            i: 'test-id',
            x: 0,
            y: 0,
          },
          {
            type: GRID_WIDGET_TYPE.enum.TEXT,
            properties: {
              title: 'Hey',
              text: 'Customize your grid grid!',
              backgroundColor: '#9db9b9',
            },
            w: 1,
            h: 1,
            i: 'test-id',
            x: 0,
            y: 1,
          },
          {
            type: GRID_WIDGET_TYPE.enum.IMAGES,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
            w: 1,
            h: 1,
            i: 'test-id',
            x: 0,
            y: 2,
          },
        ],
        gridColumns: 2,
      },
    ]
    const result = [
      {
        title: 'single',
        grid: [
          {
            type: 'IFRAME',
            width: 1,
            height: 1,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
          },
          {
            type: 'TEXT',
            width: 1,
            height: 1,
            properties: {
              title: 'Hey',
              text: 'Customize your grid grid!',
              backgroundColor: '#9db9b9',
            },
          },
          {
            type: 'IMAGE',
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

    expect(gridToConfig(grid)).toEqual(result)
  })
})
