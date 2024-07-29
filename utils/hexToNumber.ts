import { hexToNumber as web3hexToNumber } from 'web3-utils'

/**
 * Wrap function into try catch block to not break app when it fails
 *
 * @param param
 * @param value
 * @returns
 */
export const hexToNumber = (value?: string) => {
  if (!value) {
    return ''
  }

  try {
    return web3hexToNumber(value)
  } catch (error) {
    console.error(`Couldn't decode hex to number with value ${value}`, error)
    return ''
  }
}
