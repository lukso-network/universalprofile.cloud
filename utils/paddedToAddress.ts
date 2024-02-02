/**
 * Remove padding from address
 *
 * @param address
 * @returns
 */
export const paddedToAddress = (address: string) => {
  if (address.slice(0, 2) === '0x') {
    address = address.slice(2)
  }

  while (address.slice(0, 2) === '00') {
    address = address.slice(2)
  }

  return '0x' + address
}
