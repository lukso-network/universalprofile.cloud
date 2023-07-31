import { expect, test } from '@playwright/test'
import { assertAddress } from '../../../utils/validators'

test.describe('assertAddress', () => {
  test('throw when address is invalid', async ({ page }) => {
    try {
      assertAddress('0x0')
    } catch (error) {
      expect((error as unknown as Error).message).toBe(
        `'0x0' must be an address`
      )
    }
  })

  test('pass when address is valid', async ({ page }) => {
    expect(
      assertAddress('0x4440a406E00ECfe15a833119D20B848a31c80116')
    ).toBeUndefined()
  })
})
