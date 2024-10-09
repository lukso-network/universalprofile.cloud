import { describe, expect, it } from 'vitest'
import { isConfigValid } from '../isConfigValid'
import { GRID_WIDGET_TYPE } from './../../shared/config'

describe('isConfigValid', () => {
  it('should return false when gridConfig is invalid', () => {
    expect(isConfigValid()).toBe(false)
    expect(isConfigValid(null)).toBe(false)
    expect(isConfigValid({})).toBe(false)
  })

  it('should return true when gridConfig is empty', () => {
    expect(isConfigValid([])).toBe(true)
  })

  it('should return true for valid gridConfig', () => {
    const config = [
      {
        title: 'default',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: 1,
            height: 1,
            properties: {},
          },
        ],
      },
      {
        title: 'grid-1',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: 1,
            height: 1,
            properties: {},
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(true)
  })

  it('should return false for gridConfig with missing title', () => {
    const config = [
      {
        grid: [
          {
            type: 'invlidType',
            width: 1,
            height: 1,
            properties: {},
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with invalid type', () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: 'invlidType',
            width: 1,
            height: 1,
            properties: {},
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-number width', () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: '1',
            height: 1,
            properties: {},
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-number height', () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: 1,
            height: '1',
            properties: {},
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-object properties', () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.IFRAME,
            width: 1,
            height: 1,
          },
        ],
      },
    ]
    expect(isConfigValid(config)).toBe(false)
  })
})
