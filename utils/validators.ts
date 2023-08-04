import web3utils from 'web3-utils'
const { isAddress } = web3utils // need to import like this due to CommonJS module import issue

/**
 * Ensures that the given value is an address,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not an address
 */
export function assertAddress(value?: string): asserts value is Address {
  if (!value) {
    throw Error(`missing address`)
  }

  if (!isAddress(value)) {
    throw Error(`${value} is not an address`)
  }
}

/**
 * Ensures that the given value is an array of addresses,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not an array of addresses
 */
export function assertAddresses(value?: string[]): asserts value is Address[] {
  if (!value) {
    throw Error(`missing addresses`)
  }

  if (!Array.isArray(value)) {
    throw Error(`value is not an array`)
  }

  return value.forEach(value => assertAddress(value))
}

/**
 * Ensures that the given value is a string,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not a string
 */
export function assertString(value: any): asserts value is string {
  if (typeof value !== 'string') {
    throw Error(`${value} is not a string`)
  }
}
