import { LSP4_TOKEN_TYPES } from '@lukso/lsp-smart-contracts'
import { describe, expect, test } from 'vitest'

import {
  getBalance,
  hasBalance,
  hasCreator,
  hasTokenId,
  isCollectible,
  isCollection,
  isCreator,
  isLsp7,
  isLsp8,
  isLyx,
  isSupportedAsset,
  isToken,
} from '../assetChecks'

describe('isLyx', () => {
  test('should return true if the asset is a LYX', async () => {
    expect(
      isLyx({
        tokenSymbol: 'LYX',
        isNativeToken: true,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not a LYX', async () => {
    expect(
      isLyx({
        tokenSymbol: 'Some asset',
      } as Asset)
    ).toBe(false)
    expect(isLyx({} as Asset)).toBe(false)
  })
})

describe('isCollectible', () => {
  test('should return true if the asset is collectible', async () => {
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.NFT,
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(true)
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.COLLECTION,
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(true)
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.NFT,
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not collectible', async () => {
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.TOKEN,
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(false)
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.TOKEN,
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(false)
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.COLLECTION,
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(false)
    expect(isCollectible({} as Asset)).toBe(false)
  })
})

describe('isToken', () => {
  test('should return true if the asset is token', async () => {
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.TOKEN,
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(true)
    expect(
      isToken({
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(true)
    expect(
      isToken({
        isNativeToken: true,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not token', async () => {
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.NFT,
      } as Asset)
    ).toBe(false)
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.COLLECTION,
      } as Asset)
    ).toBe(false)
    expect(
      isToken({
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(false)
    expect(isToken({} as Asset)).toBe(false)
  })
})

describe('isLsp7', () => {
  test('should return true if the asset is LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(false)
    expect(
      isLsp7({
        standard: STANDARDS.EOA,
      } as Asset)
    ).toBe(false)
    expect(isLsp7({} as Asset)).toBe(false)
  })
})

describe('isLsp8', () => {
  test('should return true if the asset is LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(false)
    expect(
      isLsp8({
        standard: STANDARDS.EOA,
      } as Asset)
    ).toBe(false)
    expect(isLsp8({} as Asset)).toBe(false)
  })
})

describe('hasTokenId', () => {
  test('should return true if the asset has token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x123',
      } as unknown as Asset)
    ).toBe(true)
  })

  test('should return false if the asset has no token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x',
      } as unknown as Asset)
    ).toBe(false)
    expect(
      hasTokenId({
        tokenId: '',
      } as unknown as Asset)
    ).toBe(false)
    expect(hasTokenId({} as Asset)).toBe(false)
  })
})

describe('isAsset', () => {
  test('should return true if the asset is LSP7 or LSP8', async () => {
    expect(
      isAsset({
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(true)
    expect(
      isAsset({
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is other smart contract', async () => {
    expect(
      isAsset({
        standard: STANDARDS.EOA,
      } as Asset)
    ).toBe(false)
    expect(
      isAsset({
        standard: STANDARDS.LSP3,
      } as Asset)
    ).toBe(false)
    expect(hasTokenId({} as Asset)).toBe(false)
  })
})

describe('isCollection', () => {
  test('should return true if the asset is LSP8 collection', async () => {
    expect(
      isCollection({
        standard: STANDARDS.LSP8,
        tokenIdsData: [
          {
            standard: STANDARDS.LSP8,
          },
        ],
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8 collection', async () => {
    expect(
      isCollection({
        standard: STANDARDS.LSP8,
        tokenIdsData: [],
      } as Asset)
    ).toBe(false)
    expect(
      isCollection({
        standard: STANDARDS.LSP8,
      } as Asset)
    ).toBe(false)
    expect(
      isCollection({
        standard: STANDARDS.LSP7,
      } as Asset)
    ).toBe(false)
    expect(hasTokenId({} as Asset)).toBe(false)
  })
})

describe('hasBalance', () => {
  test('should return true when asset has a balance', () => {
    const assetWithBalance = {
      balance: '100',
    } as Asset

    expect(hasBalance(assetWithBalance)).toBe(true)
  })

  test('should return false when asset has no balance', () => {
    const assetWithoutBalance = {
      balance: '0',
    } as Asset

    expect(hasBalance(assetWithoutBalance)).toBe(false)
  })

  test('should return false when asset has no balance property', () => {
    const assetWithoutBalanceProperty = {} as Asset

    expect(hasBalance(assetWithoutBalanceProperty)).toBe(false)
  })

  test('should return false when asset is null', () => {
    const nullAsset = null as unknown as Asset

    expect(hasBalance(nullAsset)).toBe(false)
  })

  test('should return false when asset is undefined', () => {
    const undefinedAsset = undefined as unknown as Asset

    expect(hasBalance(undefinedAsset)).toBe(false)
  })
})

describe('getBalance', () => {
  test('should return the asset balance if it exists', () => {
    const assetWithBalance = {
      balance: '100',
    } as Asset

    expect(getBalance(assetWithBalance)).toBe('100')
  })

  test('should return 0 if the asset balance is not provided', () => {
    expect(getBalance({})).toBe('0')
    expect(getBalance({ balance: undefined })).toBe('0')
    // @ts-expect-error
    expect(getBalance({ balance: null })).toBe('0')
  })

  test('should return 0 if the asset balance is 0', () => {
    const assetWithZeroBalance = {
      balance: '0',
    } as Asset

    expect(getBalance(assetWithZeroBalance)).toBe('0')
  })

  test('should return 0 if the asset is null', () => {
    const nullAsset = null as unknown as Asset

    expect(getBalance(nullAsset)).toBe('0')
  })

  test('should return 0 if the asset is undefined', () => {
    const undefinedAsset = undefined as unknown as Asset

    expect(getBalance(undefinedAsset)).toBe('0')
  })
})

describe('isSupportedAsset', () => {
  test('should return true for LSP7 asset', () => {
    const lsp7Asset = { standard: STANDARDS.LSP7 } as Asset
    expect(isSupportedAsset(lsp7Asset)).toBe(true)
  })

  test('should return true for LSP8 asset', () => {
    const lsp8Asset = { standard: STANDARDS.LSP8 } as Asset
    expect(isSupportedAsset(lsp8Asset)).toBe(true)
  })

  test('should return true for LYX asset', () => {
    const lyxAsset = { isNativeToken: true } as Asset
    expect(isSupportedAsset(lyxAsset)).toBe(true)
  })

  test('should return false for unsupported asset', () => {
    expect(isSupportedAsset({ standard: STANDARDS.UNKNOWN })).toBe(false)
    // @ts-expect-error
    expect(isSupportedAsset({ standard: null })).toBe(false)
    expect(isSupportedAsset({ standard: undefined })).toBe(false)
    // @ts-expect-error
    expect(isSupportedAsset({ standard: 'asdf' })).toBe(false)
    expect(isSupportedAsset(undefined)).toBe(false)
    expect(isSupportedAsset(null)).toBe(false)
  })
})

describe('hasCreator', () => {
  test('should return true if the asset has a creator in the provided creators list', async () => {
    expect(
      hasCreator(
        {
          tokenCreatorsData: [{ address: '0x1' }],
        } as Asset,
        ['0x1']
      )
    ).toBe(true)
  })

  test('should return false if the asset does not have a creator in the provided creators list', async () => {
    expect(
      hasCreator(
        {
          tokenCreatorsData: [{ address: '0x2' }],
        } as Asset,
        ['0x1']
      )
    ).toBe(false)
  })

  test('should return false if no creators are provided', async () => {
    expect(
      hasCreator(
        {
          tokenCreatorsData: [{ address: '0x1' }],
        } as Asset,
        undefined
      )
    ).toBe(false)
  })

  test('should return false if no asset is provided', async () => {
    expect(hasCreator(undefined, ['0x1'])).toBe(false)
  })

  test('should fallback to owner if the asset does not have a creator in the provided creators list', async () => {
    expect(
      hasCreator(
        {
          tokenCreatorsData: [{ address: '0x2' }],
          ownerData: { address: '0x1' },
        } as Asset,
        ['0x1']
      )
    ).toBe(true)
  })
})

describe('isInCollection', () => {
  test('should return true if the asset is in the provided collections list', async () => {
    expect(
      isInCollection(
        {
          address: '0x1',
        } as Asset,
        ['0x1', '0x2']
      )
    ).toBe(true)
  })

  test('should return false if the asset is not in the provided collections list', async () => {
    expect(
      isInCollection(
        {
          address: '0x2',
        } as Asset,
        ['0x1']
      )
    ).toBe(false)
  })

  test('should return false if no collections are provided', async () => {
    expect(
      isInCollection(
        {
          address: '0x1',
        } as Asset,
        undefined
      )
    ).toBe(false)
  })

  test('should return false if no asset is provided', async () => {
    expect(isInCollection(undefined, ['0x1'])).toBe(false)
  })
})

describe('isCreator', () => {
  test('should return false if the asset is undefined', async () => {
    expect(isCreator(undefined, '0xCreatorAddress')).toBe(false)
  })

  test('should return false if the asset is null', async () => {
    // @ts-expect-error
    expect(isCreator(null, '0xCreatorAddress')).toBe(false)
  })

  test('should return false if the creator address is undefined', async () => {
    expect(isCreator({} as Asset, undefined)).toBe(false)
  })

  test('should return false if the creator address is null', async () => {
    // @ts-expect-error
    expect(isCreator({} as Asset, null)).toBe(false)
  })

  test('should return true if the creator address is in tokenCreators', async () => {
    expect(
      isCreator(
        {
          tokenCreators: ['0xCreatorAddress'],
        } as Asset,
        '0xCreatorAddress'
      )
    ).toBe(true)
  })

  test('should return true if the creator address matches the owner address', async () => {
    expect(
      isCreator(
        {
          owner: '0xCreatorAddress',
        } as Asset,
        '0xCreatorAddress'
      )
    ).toBe(true)
  })

  test('should return false if the creator address does not match any creator or owner', async () => {
    expect(
      isCreator(
        {
          tokenCreators: ['0xDifferentAddress'],
          owner: '0xDifferentOwnerAddress',
        } as Asset,
        '0xCreatorAddress'
      )
    ).toBe(false)
  })
})
