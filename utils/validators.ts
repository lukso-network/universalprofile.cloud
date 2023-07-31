import { isAddress } from 'web3-validator'

/**
 * Ensures that the given value is an address,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not an address
 */
export function assertAddress(
  value: string | string[]
): asserts value is Address {
  if (Array.isArray(value)) {
    return value.forEach(value => assertAddress(value))
  }

  if (!isAddress(value)) {
    throw Error(`'${value}' must be an address`)
  }
}
