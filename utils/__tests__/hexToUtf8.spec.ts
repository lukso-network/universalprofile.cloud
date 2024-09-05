import { describe, expect, test, vi } from 'vitest'
import { hexToUtf8 } from '../hexToUtf8'

describe('hexToUtf8 function', () => {
  test('returns utf8 string when decoding valid hex string', () => {
    const value = '0x68656c6c6f'
    const expectedResult = 'hello'

    expect(hexToUtf8(value)).toEqual(expectedResult)
  })

  test('returns empty string when decoding invalid hex string', () => {
    const value = 'invalidHex'

    expect(hexToUtf8(value)).toEqual('')
  })

  test('returns empty string when decoding empty string', () => {
    const value = ''

    expect(hexToUtf8(value)).toEqual('')
  })

  test('returns empty string when decoding null value', () => {
    const value = null

    // @ts-expect-error
    expect(hexToUtf8(value)).toEqual('')
  })

  test('returns empty string when decoding undefined value', () => {
    const value = undefined

    expect(hexToUtf8(value)).toEqual('')
  })

  test('returns utf8 string when decoding hex string representing zero', () => {
    const value = '0x30'
    const expectedResult = '0'

    expect(hexToUtf8(value)).toEqual(expectedResult)
  })

  test('logs error when decoding fails', () => {
    const value = 'invalidHex'
    const consoleErrorSpy = vi.spyOn(console, 'warn')

    hexToUtf8(value)

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
