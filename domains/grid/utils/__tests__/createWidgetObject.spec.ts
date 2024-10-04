import { describe, expect, it, vi } from 'vitest'
import { createWidgetObject } from '../createWidgetObject'

vi.mock('/domains/grid/utils/generateItemId', () => ({
  generateItemId: () => 'test-id',
}))

describe('createWidgetObject', () => {
  it('should create a widget object with default values', () => {
    const newWidget = {
      type: GRID_WIDGET_TYPE.IFRAME,
    }
    const result = createWidgetObject(newWidget)

    expect(result).toEqual({
      type: 'IFRAME',
      w: 1,
      h: 1,
      i: 'test-id',
      properties: {},
    })
  })

  it('should create a widget object with passed values', () => {
    const newWidget = {
      type: GRID_WIDGET_TYPE.IFRAME,
      w: 2,
      h: 2,
      properties: {
        src: 'https://example.com',
      },
    }
    const result = createWidgetObject(newWidget)

    expect(result).toEqual({
      type: 'IFRAME',
      w: 2,
      h: 2,
      i: 'test-id',
      properties: {
        src: 'https://example.com',
      },
    })
  })

  it('should throw an error if widget type is undefined', () => {
    expect(() => createWidgetObject({})).toThrow(
      'Widget `type` field is undefined'
    )
  })

  it('should throw an error if widget type is invalid', () => {
    // @ts-expect-error
    expect(() => createWidgetObject({ type: 'invalidType' })).toThrow(
      'Invalid widget `type` filed'
    )
  })
})
