import { p } from 'pinia-orm/dist/shared/pinia-orm.ed84a779'
import { describe, expect, it } from 'vitest'
import { isConfigValid } from '../isConfigValid'
import { GRID_WIDGET_TYPE } from './../../shared/config'

describe('isConfigValid', () => {
  it('should return false when gridConfig is invalid', async () => {
    expect(await isConfigValid()).toBe(false)
    expect(await isConfigValid(null)).toBe(false)
    expect(await isConfigValid({})).toBe(false)
  })

  it('should return true when gridConfig is empty', async () => {
    expect(await isConfigValid([])).toBe(true)
  })

  it('should return true for valid gridConfig', async () => {
    const config = [
      {
        title: 'default',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
            properties: {
              src: 'https://www.google.com',
            },
          },
        ],
      },
      {
        title: 'grid-1',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
            properties: {
              src: 'https://www.google.com',
            },
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(true)
  })

  it('should return false for gridConfig with missing title', async () => {
    const config = [
      {
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
            properties: {
              src: 'https://www.google.com',
            },
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with invalid type', async () => {
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
    expect(await isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-number width', async () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: '1',
            height: 1,
            properties: {},
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-number height', async () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: '1',
            properties: {},
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with non-object properties', async () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(false)
  })

  it('should return false for gridConfig with incorrect properties for type', async () => {
    const config = [
      {
        title: 'someName',
        grid: [
          {
            type: GRID_WIDGET_TYPE.enum.IFRAME,
            width: 1,
            height: 1,
            properties: {
              asdf: 'lul',
            },
          },
        ],
      },
    ]
    expect(await isConfigValid(config)).toBe(false)
  })
})
