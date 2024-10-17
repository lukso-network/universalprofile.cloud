import { describe, expect, it, vi } from 'vitest'
import { configToLayout } from '../configToLayout'

vi.mock('/domains/grid/utils/generateItemId', () => ({
  generateItemId: () => 'test-id',
}))

describe('configToLayout', () => {
  it('should create unique id for each grid item', () => {
    const config = [
      {
        title: 'default',
        grid: [],
      },
      {
        title: 'default',
        grid: [],
      },
    ]
    const result = [
      {
        id: 'default',
        title: 'default',
        grid: [],
      },
      {
        id: 'default-0',
        title: 'default',
        grid: [],
      },
    ]

    expect(configToLayout(config)).toEqual(result)
  })

  it('should return an empty layout for an empty config', () => {
    expect(configToLayout([])).toEqual([])
  })

  it('should correctly handle a single item config', () => {
    const config = [
      {
        title: 'single',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: 1,
            height: 1,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
          },
          {
            type: GRID_WIDGET_TYPE.TEXT,
            width: 1,
            height: 1,
            properties: {
              title: 'Hey',
              text: 'Customize your grid layout!',
              backgroundColor: '#9db9b9',
            },
          },
          {
            type: GRID_WIDGET_TYPE.IMAGE,
            width: 1,
            height: 1,
            properties: {
              src: 'https://via.placeholder.com/150',
            },
          },
        ],
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
              text: 'Customize your grid layout!',
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
      },
    ]

    expect(configToLayout(config)).toEqual(result)
  })
})
