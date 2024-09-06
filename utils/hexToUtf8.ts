import { hexToUtf8 as web3hexToUtf8 } from 'web3-utils'

/**
 * Wrap function into try catch block to not break app when it fails
 *
 * @param param
 * @param value
 * @returns
 */
export const hexToUtf8 = (value?: string) => {
  if (!value) {
    return ''
  }

  try {
    return web3hexToUtf8(value)
  } catch (error) {
    console.warn(`Couldn't decode hex to utf8 with value ${value}`, error)
    return ''
  }
}
