import { describe, expect, it } from 'vitest'
import { queryParamsString } from '../queryParamsString'

describe('queryParamsString', () => {
  it('should convert an object of query parameters into a query string', () => {
    const params = {
      foo: 'bar',
      baz: 'qux',
    }
    const expected = 'foo=bar&baz=qux'
    const actual = queryParamsString(params)
    expect(actual).toEqual(expected)
  })
})
