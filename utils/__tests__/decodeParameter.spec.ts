import { describe, expect, test, vi } from 'vitest'
import ABICoder from 'web3-eth-abi'
import { decodeParameter } from '../decodeParameter'

describe('decodeParameter function', () => {
  test('returns decoded uint256 value when decoding succeeds', () => {
    const param = 'uint256'
    const value =
      '0x0000000000000000000000000000000000000000000000000000000000000001'
    const expectedResult = '1'

    expect(decodeParameter(param, value)).toEqual(expectedResult)
  })

  test('returns decoded address value when decoding succeeds', () => {
    const param = 'address'
    const value =
      '0x000000000000000000000000a34fa53aa34990080b83fa404126d4295074f35b'
    const expectedResult = '0xa34fA53aa34990080B83FA404126D4295074f35B'

    expect(decodeParameter(param, value)).toEqual(expectedResult)
  })

  test('returns empty string when decoding fails due to invalid parameter type', () => {
    const param = 'invalidType'
    const value =
      '0x0000000000000000000000000000000000000000000000000000000000000001'

    expect(decodeParameter(param, value)).toEqual('')
  })

  test('returns empty string when decoding fails due to invalid value', () => {
    const param = 'uint256'
    const value = 'invalidValue'

    expect(decodeParameter(param, value)).toEqual('')
  })

  test('returns empty string when decoding fails due to ABICoder error', () => {
    // Mock ABICoder.decodeParameter to throw an error
    const originalDecodeParameter = ABICoder.decodeParameter
    ABICoder.decodeParameter = vi.fn().mockImplementation(() => {
      throw new Error('Mock ABI Coder error')
    })

    const param = 'uint256'
    const value =
      '0x0000000000000000000000000000000000000000000000000000000000000001'

    expect(decodeParameter(param, value)).toEqual('')

    // Restore original ABICoder.decodeParameter
    ABICoder.decodeParameter = originalDecodeParameter
  })

  test('returns empty string when decoding fails due to invalid input', () => {
    const param = ''
    const value = ''

    expect(decodeParameter(param, value)).toEqual('')
  })
})
