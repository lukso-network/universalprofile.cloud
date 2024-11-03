import { describe, expect, it } from 'vitest'

import { stringSort } from '../sort'

describe('stringSort', () => {
  it('should sort strings in ascending order', () => {
    const result = stringSort('apple', 'banana', 'asc')
    expect(result).toBeLessThan(0)
  })

  it('should sort strings in descending order', () => {
    const result = stringSort('apple', 'banana', 'desc')
    expect(result).toBeGreaterThan(-1)
  })

  it('should handle undefined values', () => {
    const result = stringSort(undefined, 'banana', 'asc')
    expect(result).toBe(-1)
  })

  it('should handle empty strings', () => {
    const result = stringSort('', 'banana', 'asc')
    expect(result).toBeLessThan(0)
  })

  it('should sort strings with leading spaces correctly', () => {
    const result = stringSort('  apple', 'banana', 'asc')
    expect(result).toBeLessThan(0)
  })

  it('should return 0 when both values are undefined', () => {
    const result = stringSort(undefined, undefined, 'asc')
    expect(result).toBe(0)
  })

  it('should return 0 when both values are empty strings', () => {
    const result = stringSort('', '', 'asc')
    expect(result).toBe(0)
  })

  it('sort array ascending', () => {
    const array = ['banana', 'apple', 'orange']
    const result = array.sort((a, b) => stringSort(a, b, 'asc'))
    expect(result).toEqual(['apple', 'banana', 'orange'])
  })

  it('sort array descending', () => {
    const array = ['banana', 'apple', 'orange']
    const result = array.sort((a, b) => stringSort(a, b, 'desc'))
    expect(result).toEqual(['orange', 'banana', 'apple'])
  })
})
