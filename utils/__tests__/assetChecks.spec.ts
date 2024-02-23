import { expect, test, describe } from 'vitest'

import {
  isLyx,
  isCollectible,
  isToken,
  isLsp7,
  isLsp8,
  hasTokenId,
} from '../assetChecks'

describe('isLyx', () => {
  test('should return true if the asset is a LYX', async () => {
    expect(
      isLyx({
        name: 'LYX',
        isNativeToken: true,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not a LYX', async () => {
    expect(
      isLyx({
        name: 'Some asset',
      })
    ).toBe(false)
    expect(isLyx({})).toBe(false)
  })
})

describe('isCollectible', () => {
  test('should return true if the asset is collectible', async () => {
    expect(
      isCollectible({
        tokenType: 'NFT',
      })
    ).toBe(true)
    expect(
      isCollectible({
        tokenType: 'COLLECTION',
      })
    ).toBe(true)
  })

  test('should return false if the asset is not collectible', async () => {
    expect(
      isCollectible({
        tokenType: 'TOKEN',
      })
    ).toBe(false)
    expect(isCollectible({})).toBe(false)
  })
})

describe('isToken', () => {
  test('should return true if the asset is token', async () => {
    expect(
      isToken({
        tokenType: 'TOKEN',
      })
    ).toBe(true)
    expect(
      isToken({
        isNativeToken: true,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not token', async () => {
    expect(
      isToken({
        tokenType: 'NFT',
      })
    ).toBe(false)
    expect(
      isToken({
        tokenType: 'COLLECTION',
      })
    ).toBe(false)
    expect(isToken({})).toBe(false)
  })
})

describe('isLsp7', () => {
  test('should return true if the asset is LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP7,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP8,
      })
    ).toBe(false)
    expect(
      isLsp7({
        standard: STANDARDS.EOA,
      })
    ).toBe(false)
    expect(isLsp7({})).toBe(false)
  })
})

describe('isLsp8', () => {
  test('should return true if the asset is LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP8,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP7,
      })
    ).toBe(false)
    expect(
      isLsp8({
        standard: STANDARDS.EOA,
      })
    ).toBe(false)
    expect(isLsp8({})).toBe(false)
  })
})

describe('hasTokenId', () => {
  test('should return true if the asset has token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x123',
      })
    ).toBe(true)
  })

  test('should return false if the asset has no token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x',
      })
    ).toBe(false)
    expect(
      hasTokenId({
        tokenId: '',
      })
    ).toBe(false)
    expect(hasTokenId({})).toBe(false)
  })
})

describe('isAsset', () => {
  test('should return true if the asset is LSP7 or LSP8', async () => {
    expect(
      isAsset({
        standard: STANDARDS.LSP7,
      })
    ).toBe(true)
    expect(
      isAsset({
        standard: STANDARDS.LSP8,
      })
    ).toBe(true)
  })

  test('should return false if the asset is other smart contract', async () => {
    expect(
      isAsset({
        standard: STANDARDS.EOA,
      })
    ).toBe(false)
    expect(
      isAsset({
        standard: STANDARDS.LSP3,
      })
    ).toBe(false)
    expect(hasTokenId({})).toBe(false)
  })
})
