import { numberToHex as web3numberToHex } from 'web3-utils'

/**
 * Wrap function into try catch block to not break app when it fails
 *
 * @param value
 */
export const numberToHex = (value: string | number) => {
  try {
    return web3numberToHex(value)
  } catch (error) {
    console.warn(`Couldn't convert number to hex with value ${value}`, error)
    return ''
  }
}
