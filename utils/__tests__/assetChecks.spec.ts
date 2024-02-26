import { expect, test, describe } from 'vitest'

import {
  isLyx,
  isCollectible,
  isToken,
  isLsp7,
  isLsp8,
  hasTokenId,
} from '../assetChecks'
import type { TokenData } from '@/composables/useToken'

describe('isLyx', () => {
  test('should return true if the asset is a LYX', async () => {
    expect(
      isLyx({
        name: 'LYX',
        isNativeToken: true,
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is not a LYX', async () => {
    expect(
      isLyx({
        name: 'Some asset',
      } as TokenData)
    ).toBe(false)
    expect(isLyx({} as TokenData)).toBe(false)
  })
})

describe('isCollectible', () => {
  test('should return true if the asset is collectible', async () => {
    expect(
      isCollectible({
        tokenType: 'NFT',
      } as TokenData)
    ).toBe(true)
    expect(
      isCollectible({
        tokenType: 'COLLECTION',
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is not collectible', async () => {
    expect(
      isCollectible({
        tokenType: 'TOKEN',
      } as TokenData)
    ).toBe(false)
    expect(isCollectible({} as TokenData)).toBe(false)
  })
})

describe('isToken', () => {
  test('should return true if the asset is token', async () => {
    expect(
      isToken({
        tokenType: 'TOKEN',
      } as TokenData)
    ).toBe(true)
    expect(
      isToken({
        isNativeToken: true,
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is not token', async () => {
    expect(
      isToken({
        tokenType: 'NFT',
      } as TokenData)
    ).toBe(false)
    expect(
      isToken({
        tokenType: 'COLLECTION',
      } as TokenData)
    ).toBe(false)
    expect(isToken({} as TokenData)).toBe(false)
  })
})

describe('isLsp7', () => {
  test('should return true if the asset is LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP7,
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP8,
      } as TokenData)
    ).toBe(false)
    expect(
      isLsp7({
        standard: STANDARDS.EOA,
      } as TokenData)
    ).toBe(false)
    expect(isLsp7({} as TokenData)).toBe(false)
  })
})

describe('isLsp8', () => {
  test('should return true if the asset is LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP8,
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP7,
      } as TokenData)
    ).toBe(false)
    expect(
      isLsp8({
        standard: STANDARDS.EOA,
      } as TokenData)
    ).toBe(false)
    expect(isLsp8({} as TokenData)).toBe(false)
  })
})

describe('hasTokenId', () => {
  test('should return true if the asset has token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x123',
      } as unknown as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset has no token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x',
      } as unknown as TokenData)
    ).toBe(false)
    expect(
      hasTokenId({
        tokenId: '',
      } as unknown as TokenData)
    ).toBe(false)
    expect(hasTokenId({} as TokenData)).toBe(false)
  })
})

describe('isAsset', () => {
  test('should return true if the asset is LSP7 or LSP8', async () => {
    expect(
      isAsset({
        standard: STANDARDS.LSP7,
      } as TokenData)
    ).toBe(true)
    expect(
      isAsset({
        standard: STANDARDS.LSP8,
      } as TokenData)
    ).toBe(true)
  })

  test('should return false if the asset is other smart contract', async () => {
    expect(
      isAsset({
        standard: STANDARDS.EOA,
      } as TokenData)
    ).toBe(false)
    expect(
      isAsset({
        standard: STANDARDS.LSP3,
      } as TokenData)
    ).toBe(false)
    expect(hasTokenId({} as TokenData)).toBe(false)
  })
})
