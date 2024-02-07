import keccak256 from 'keccak256'

/**
 * Get hash from passed string using keccak256
 *
 * @param value
 * @returns
 */
export const getHash = (value?: string): string => {
  if (!value) {
    return ''
  }

  return keccak256(value).toString('hex')
}
