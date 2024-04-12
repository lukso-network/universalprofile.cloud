/**
 * Truncate string to given length and add '...' at the end
 *
 * @param value
 * @param length
 * @returns
 */
export const truncate = (value: string, length: number) => {
  if (length <= 0 || !value) {
    return ''
  }

  return value.length > length ? `${value.slice(0, length - 1)}...` : value
}
