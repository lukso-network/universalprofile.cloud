import { validateAttributes } from '../validateLsp4Metadata'
import { expect, test } from 'vitest'

test('validateAttribute', () => {
  expect(validateAttributes([])).toEqual([])
  expect(validateAttributes(undefined)).toEqual([])

  // when more "custom" attributer
  expect(
    validateAttributes([
      {
        test: '123',
        key: 'size',
        value: 123,
        type: 'number',
      },
    ])
  ).toEqual([
    {
      test: '123',
      key: 'size',
      value: 123,
      type: 'number',
    },
  ])

  // when at least one valid
  expect(
    validateAttributes([
      {
        value: 123,
      },
    ])
  ).toEqual([
    {
      value: 123,
    },
  ])

  // when invalid attributes are present
  expect(
    validateAttributes([
      {
        test: '123',
      },
    ])
  ).toEqual([])
})
