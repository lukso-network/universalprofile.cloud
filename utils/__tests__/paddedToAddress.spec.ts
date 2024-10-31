import { expect, test } from 'vitest'

import { paddedToAddress } from '../paddedToAddress'

test('paddedToAddress should remove zero padding from an address', async () => {
  expect(paddedToAddress('0x0023456789012345678901234567890123456789')).toEqual(
    '0x0023456789012345678901234567890123456789'
  )
  expect(
    paddedToAddress('0x00000000001234567890123456789012345678901234567890')
  ).toEqual('0x1234567890123456789012345678901234567890')
  expect(paddedToAddress('0x0000000000000000000000000000000000000000')).toEqual(
    '0x0000000000000000000000000000000000000000'
  )
  expect(paddedToAddress('0x')).toEqual('')
  expect(paddedToAddress('0x123456')).toEqual('')
  expect(paddedToAddress('')).toEqual('')
  expect(paddedToAddress(undefined)).toEqual('')
})
