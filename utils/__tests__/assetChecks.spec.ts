import { expect, test } from '@playwright/test'
import { ASSET_TYPES } from '@/shared/enums'

import {
  isLyx,
  isCollectible,
  isToken,
  isLsp7,
  isLsp8,
  hasTokenId,
} from '../assetChecks'

test.describe('isLyx', () => {
  test('should return true if the asset is a LYX', async ({ page }) => {
    expect(
      isLyx({
        name: 'LYX',
        isNativeToken: true,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not a LYX', async ({ page }) => {
    expect(
      isLyx({
        name: 'Some asset',
      })
    ).toBe(false)
    expect(isLyx({})).toBe(false)
  })
})

test.describe('isCollectible', () => {
  test('should return true if the asset is collectible', async ({ page }) => {
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

  test('should return false if the asset is not collectible', async ({
    page,
  }) => {
    expect(
      isCollectible({
        tokenType: 'TOKEN',
      })
    ).toBe(false)
    expect(isCollectible({})).toBe(false)
  })
})

test.describe('isToken', () => {
  test('should return true if the asset is token', async ({ page }) => {
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

  test('should return false if the asset is not token', async ({ page }) => {
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

test.describe('isLsp7', () => {
  test('should return true if the asset is LSP7', async ({ page }) => {
    expect(
      isLsp7({
        standard: ASSET_TYPES.LSP7,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not LSP7', async ({ page }) => {
    expect(
      isLsp7({
        standard: ASSET_TYPES.LSP8,
      })
    ).toBe(false)
    expect(
      isLsp7({
        standard: ASSET_TYPES.EOA,
      })
    ).toBe(false)
    expect(isLsp7({})).toBe(false)
  })
})

test.describe('isLsp8', () => {
  test('should return true if the asset is LSP8', async ({ page }) => {
    expect(
      isLsp8({
        standard: ASSET_TYPES.LSP8,
      })
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8', async ({ page }) => {
    expect(
      isLsp8({
        standard: ASSET_TYPES.LSP7,
      })
    ).toBe(false)
    expect(
      isLsp8({
        standard: ASSET_TYPES.EOA,
      })
    ).toBe(false)
    expect(isLsp8({})).toBe(false)
  })
})

test.describe('hasTokenId', () => {
  test('should return true if the asset has token Id', async ({ page }) => {
    expect(
      hasTokenId({
        tokenId: '0x123',
      })
    ).toBe(true)
  })

  test('should return false if the asset has no token Id', async ({ page }) => {
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
