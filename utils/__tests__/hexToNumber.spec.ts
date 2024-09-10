import { describe, expect, test, vi } from 'vitest'
import { hexToNumber } from '../hexToNumber'

describe('hexToNumber function', () => {
  test('returns number when decoding valid hex string', () => {
    const value = '0x1'
    const expectedResult = 1

    expect(hexToNumber(value)).toEqual(expectedResult)
  })

  test('returns empty string when decoding invalid hex string', () => {
    const value = 'invalidHex'

    expect(hexToNumber(value)).toEqual('')
  })

  test('returns empty string when decoding empty string', () => {
    const value = ''

    expect(hexToNumber(value)).toEqual('')
  })

  test('returns empty string when decoding null value', () => {
    const value = null

    // @ts-expect-error
    expect(hexToNumber(value)).toEqual('')
  })

  test('returns empty string when decoding undefined value', () => {
    const value = undefined

    expect(hexToNumber(value)).toEqual('')
  })

  test('returns number when decoding hex string representing zero', () => {
    const value = '0x0'
    const expectedResult = 0

    expect(hexToNumber(value)).toEqual(expectedResult)
  })

  test('logs error when decoding fails', () => {
    const value = 'invalidHex'
    const consoleErrorSpy = vi.spyOn(console, 'warn')

    hexToNumber(value)

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
