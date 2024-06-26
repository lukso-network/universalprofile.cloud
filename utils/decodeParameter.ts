import ABICoder from 'web3-eth-abi'

/**
 * Wrap decode parameter function into try catch block to not break app when decoding fails
 *
 * @param param
 * @param value
 * @returns
 */
export const decodeParameter = (param: string, value: string) => {
  try {
    return ABICoder.decodeParameter(param, value)
  } catch (error) {
    console.error(`Couldn't decode ${param} with value ${value}`, error)
    return ''
  }
}
