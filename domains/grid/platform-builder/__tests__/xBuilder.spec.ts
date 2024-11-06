import { describe, it, expect } from 'vitest'

import { xBuilder } from '../xBuilder'

describe('xBuilder', () => {
  it('should return the correct URL for a timeline type', () => {
    const properties = {
      id: '',
      username: 'testuser',
      type: xType.enum.timeline,
    }
    const result = xBuilder(properties)
    expect(result.src).toBe('https://twitter.com/testuser')
  })

  it('should return the correct URL for a status type with an id', () => {
    const properties = {
      id: '12345',
      username: 'testuser',
      type: xType.enum.status,
    }
    const result = xBuilder(properties)
    expect(result.src).toBe('https://twitter.com/testuser/status/12345')
  })

  it('should return an empty string for an unknown type without an id', () => {
    const properties = {
      id: '',
      username: 'testuser',
      type: 'unknown',
    }

    // @ts-expect-error
    const result = xBuilder(properties)
    expect(result.src).toBe('')
  })

  it('should return the correct URL for a status when type is unknown and with an id', () => {
    const properties = {
      id: '12345',
      username: 'testuser',
      type: 'unknown',
    }
    // @ts-expect-error
    const result = xBuilder(properties)
    expect(result.src).toBe('https://twitter.com/testuser/status/12345')
  })
})
