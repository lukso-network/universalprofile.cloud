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

describe('universalPageAssetUrl', () => {
  test('returns correct URL format with a valid address and tokenId', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const tokenId = '1'
    const expectedUrl =
      'https://universal.page/collections/lukso/0x1234567890abcdef1234567890abcdef12345678/1'
    expect(universalPageAssetUrl(address, tokenId)).toBe(expectedUrl)
  })

  test('returns correct URL format with a valid address and no tokenId', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const expectedUrl =
      'https://universal.page/assets/lukso/0x1234567890abcdef1234567890abcdef12345678'
    expect(universalPageAssetUrl(address)).toBe(expectedUrl)
  })

  test('throws an error when address is null', () => {
    // @ts-expect-error
    expect(() => universalPageAssetUrl(null)).toThrow('Address is required')
  })

  test('throws an error when address is an empty string', () => {
    // @ts-expect-error
    expect(() => universalPageAssetUrl('')).toThrow('Address is required')
  })

  test('throws an error when address is not a valid Ethereum address', () => {
    const invalidAddress = '0x1234567890abcdef1234567890abcdef1234567'
    expect(() => universalPageAssetUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })

  test('throws an error when address is not a string', () => {
    const invalidAddress = 1234567890
    // @ts-expect-error
    expect(() => universalPageAssetUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })
})

describe('universalSwapsAssetUrl', () => {
  test('returns correct URL format with a valid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const expectedUrl =
      'https://universalswaps.io/tokens/lukso/0x1234567890abcdef1234567890abcdef12345678'
    expect(universalSwapsAssetUrl(address)).toBe(expectedUrl)
  })

  test('throws an error when address is null', () => {
    // @ts-expect-error
    expect(() => universalSwapsAssetUrl(null)).toThrow('Address is required')
  })

  test('throws an error when address is an empty string', () => {
    // @ts-expect-error
    expect(() => universalSwapsAssetUrl('')).toThrow('Address is required')
  })

  test('throws an error when address is not a valid Ethereum address', () => {
    const invalidAddress = '0x1234567890abcdef1234567890abcdef1234567'
    expect(() => universalSwapsAssetUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })

  test('throws an error when address is not a string', () => {
    const invalidAddress = 1234567890
    // @ts-expect-error
    expect(() => universalSwapsAssetUrl(invalidAddress)).toThrow(
      'Address is not a valid address'
    )
  })
})
