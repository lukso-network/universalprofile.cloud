import { expect, it, describe } from 'vitest'
import {
  fromTokenUnitWithDecimals,
  toTokenUnitWithDecimals,
} from '../tokenConversionWithDecimals'

describe('weiWithDecimals', () => {
  it('should convert from wei with 18 decimals', () => {
    const value = '1000000000000000000'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value)
    expect(result).toEqual(expected)
  })

  it('should convert from wei with 0 decimals', () => {
    const value = '1'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value, 0)
    expect(result).toEqual(expected)
  })

  it('should convert from wei with 2 decimals', () => {
    const value = '100'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value, 2)
    expect(result).toEqual(expected)
  })

  it('should convert to wei with 18 decimals', () => {
    const value = '1'
    const expected = '1000000000000000000'
    const result = toTokenUnitWithDecimals(value)
    expect(result).toEqual(expected)
  })

  it('should convert to wei with 0 decimals', () => {
    const value = '1'
    const expected = '1'
    const result = toTokenUnitWithDecimals(value, 0)
    expect(result).toEqual(expected)
  })

  it('should convert to wei with 2 decimals', () => {
    const value = '1'
    const expected = '100'
    const result = toTokenUnitWithDecimals(value, 2)
    expect(result).toEqual(expected)
  })
})
