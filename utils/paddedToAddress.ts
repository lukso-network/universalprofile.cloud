import web3 from 'web3'

/**
 * Remove padding from address
 *
 * @param address
 * @returns
 */
export const paddedToAddress = (address?: string) => {
  if (!address || address.length < 42) {
    return ''
  }

  // remove 0x
  if (address.startsWith('0x')) {
    address = address.slice(2)
  }

  // remove padding
  while (address.slice(0, 2) === '00' && !web3.utils.isAddress(address)) {
    address = address.slice(2)
  }

  return '0x' + address
}
