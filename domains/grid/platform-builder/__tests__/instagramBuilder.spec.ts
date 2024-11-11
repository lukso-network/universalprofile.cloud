import { describe, expect, it } from 'vitest'

import { instagramBuilder } from '../instagramBuilder'

describe('instagramBuilder', () => {
  it('should return the correct URL for a valid type and id', () => {
    const properties = {
      id: '12345',
      type: instagramType.enum.p,
    }
    const result = instagramBuilder(properties)
    expect(result.src).toBe('https://www.instagram.com/p/12345')
  })

  it('should return an empty string when id is missing', () => {
    const properties = {
      id: '',
      type: instagramType.enum.p,
    }
    const result = instagramBuilder(properties)
    expect(result.src).toBe('')
  })

  it('should return an empty string when type is missing', () => {
    const properties = {
      id: '12345',
      type: '',
    }
    // @ts-expect-error
    const result = instagramBuilder(properties)
    expect(result.src).toBe('')
  })

  it('should return an empty string when both id and type are missing', () => {
    const properties = {
      id: '',
      type: '',
    }
    // @ts-expect-error
    const result = instagramBuilder(properties)
    expect(result.src).toBe('')
  })
})
