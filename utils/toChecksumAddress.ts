import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils'

/**
 * Wrap function into try catch block to not break app when it fails
 *
 * @param value
 * @returns
 */
export const toChecksumAddress = (value?: string | Address) => {
  if (!value) {
    return ''
  }

  try {
    return toChecksumAddressWeb3(value)
  } catch (error) {
    console.warn(error)
    return ''
  }
}
