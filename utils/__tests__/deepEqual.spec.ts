import { describe, expect, it } from 'vitest'

import { deepEqual } from '../deepEqual'

describe('deepEqual', () => {
  it('returns true for identical objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 2 }
    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  it('returns false for different objects', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: 3 }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('returns false for objects with different keys', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, c: 2 }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('returns true for nested identical objects', () => {
    const obj1 = { a: { b: 2, c: 3 }, d: 4 }
    const obj2 = { a: { b: 2, c: 3 }, d: 4 }
    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  it('returns false for nested different objects', () => {
    const obj1 = { a: { b: 2, c: 3 }, d: 4 }
    const obj2 = { a: { b: 2, c: 4 }, d: 4 }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('returns true for identical objects with arrays', () => {
    const obj1 = { a: [1, 2, 3], b: 4 }
    const obj2 = { a: [1, 2, 3], b: 4 }
    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  it('returns false for objects with different arrays', () => {
    const obj1 = { a: [1, 2, 3], b: 4 }
    const obj2 = { a: [1, 2, 4], b: 4 }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('returns false for objects of different types', () => {
    const obj1 = { a: 1, b: 2 }
    const obj2 = { a: 1, b: '2' }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })

  it('returns true for identical empty objects', () => {
    const obj1 = {}
    const obj2 = {}
    expect(deepEqual(obj1, obj2)).toBe(true)
  })

  it('returns false for one empty and one non-empty object', () => {
    const obj1 = {}
    const obj2 = { a: 1 }
    expect(deepEqual(obj1, obj2)).toBe(false)
  })
})
