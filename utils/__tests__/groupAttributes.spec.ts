import { describe, it, expect } from 'vitest'
import { groupAttributes } from '../groupAttributes'

describe('groupAttributes', () => {
  it('returns an empty array when attributesData is undefined', () => {
    const result = groupAttributes()
    expect(result).toEqual([])
  })

  it('returns an empty array when attributesData is null', () => {
    // @ts-expect-error
    const result = groupAttributes(null)
    expect(result).toEqual([])
  })

  it('correctly groups single attribute', () => {
    const attributesData = [{ group: 'social', value: 'twitter' }]
    const result = groupAttributes(attributesData)
    expect(result).toEqual([
      { id: 'social', group: 'social', values: ['twitter'] },
    ])
  })

  it('correctly groups multiple attributes into respective groups', () => {
    const attributesData = [
      { group: 'social', value: 'twitter' },
      { group: 'social', value: 'facebook' },
      { group: 'contact', value: 'email' },
    ]
    const result = groupAttributes(attributesData)
    expect(result).toEqual([
      { id: 'contact', group: 'contact', values: ['email'] },
      { id: 'social', group: 'social', values: ['facebook', 'twitter'] },
    ])
  })

  it('ignores attributes with null group values', () => {
    const attributesData = [
      { group: null, value: 'ignored' },
      { group: 'social', value: 'twitter' },
    ]
    const result = groupAttributes(attributesData)
    expect(result).toEqual([
      { id: 'social', group: 'social', values: ['twitter'] },
    ])
  })

  it('ignores attributes with undefined group values', () => {
    const attributesData = [
      { group: undefined, value: 'ignored' },
      { group: 'social', value: 'twitter' },
    ]
    const result = groupAttributes(attributesData)
    expect(result).toEqual([
      { id: 'social', group: 'social', values: ['twitter'] },
    ])
  })

  it('returns attributes sorted by group name', () => {
    const attributesData = [
      { group: 'b-group', value: 'value2' },
      { group: 'a-group', value: 'value1' },
    ]
    const result = groupAttributes(attributesData)
    expect(result).toEqual([
      { id: 'a-group', group: 'a-group', values: ['value1'] },
      { id: 'b-group', group: 'b-group', values: ['value2'] },
    ])
  })
})
