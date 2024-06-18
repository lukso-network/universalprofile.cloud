import { describe, expect, test } from 'vitest'
import {
  universalPageProfileUrl,
  universalSwapsProfileUrl,
} from '../externalUrls'

describe('universalPageProfileUrl', () => {
  test('returns correct URL format with a valid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const expectedUrl =
      'https://universal.page/profiles/lukso/0x1234567890abcdef1234567890abcdef12345678'
    expect(universalPageProfileUrl(address)).toBe(expectedUrl)
  })

  test('throws an error when address is null', () => {
    // @ts-expect-error
    expect(() => universalPageProfileUrl(null)).toThrow('Address is required')
  })

  test('throws an error when address is an empty string', () => {
    // @ts-expect-error
    expect(() => universalPageProfileUrl('')).toThrow('Address is required')
  })

  test('throws an error when address is not a valid Ethereum address', () => {
    const invalidAddress = '0x1234567890abcdef1234567890abcdef1234567'
    expect(() => universalPageProfileUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })

  test('throws an error when address is not a string', () => {
    const invalidAddress = 1234567890
    // @ts-expect-error
    expect(() => universalPageProfileUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })
})

describe('universalSwapsProfileUrl', () => {
  test('returns correct URL format with a valid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const expectedUrl =
      'https://universalswaps.io/social/0x1234567890abcdef1234567890abcdef12345678'
    expect(universalSwapsProfileUrl(address)).toBe(expectedUrl)
  })

  test('throws an error when address is null', () => {
    // @ts-expect-error
    expect(() => universalSwapsProfileUrl(null)).toThrow('Address is required')
  })

  test('throws an error when address is an empty string', () => {
    // @ts-expect-error
    expect(() => universalSwapsProfileUrl('')).toThrow('Address is required')
  })

  test('throws an error when address is not a valid Ethereum address', () => {
    const invalidAddress = '0x1234567890abcdef1234567890abcdef1234567'
    expect(() => universalSwapsProfileUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })

  test('throws an error when address is not a string', () => {
    const invalidAddress = 1234567890
    // @ts-expect-error
    expect(() => universalSwapsProfileUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })
})
