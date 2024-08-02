import { describe, expect, it } from 'vitest'

import { getPositiveNumber } from '../getPositiveNumber'

describe('getPositiveNumber', () => {
  it('works with string with positive value', () => {
    expect(getPositiveNumber('123')).toBe(123)
  })

  it('returns 0 when string is negative value', () => {
    expect(getPositiveNumber('-123')).toBe(0)
  })

  it('works with positive number value', () => {
    expect(getPositiveNumber(123)).toBe(123)
  })

  it('returns 0 when value is 0', () => {
    expect(getPositiveNumber(0)).toBe(0)
  })

  it('returns 0 when value is negative', () => {
    expect(getPositiveNumber(-1)).toBe(0)
  })

  it('returns 0 when value is not a number', () => {
    expect(getPositiveNumber('abc')).toBe(0)
  })

  it('returns 0 when value is null', () => {
    //@ts-expect-error
    expect(getPositiveNumber(null)).toBe(0)
  })

  it('returns 0 when value is undefined', () => {
    expect(getPositiveNumber(undefined)).toBe(0)
  })

  it('returns 0 when value is an empty string', () => {
    expect(getPositiveNumber('')).toBe(0)
  })
})
