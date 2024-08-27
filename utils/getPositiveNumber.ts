/**
 * Get positive number from string or number
 *
 * @param value
 * @returns
 */
export const getPositiveNumber = (value?: string | number): number => {
  if (typeof value === 'string') {
    const number = Number.parseInt(value, 10)
    return Number.isNaN(number) || number < 0 ? 0 : number
  }

  if (typeof value === 'number') {
    return value < 0 ? 0 : value
  }

  return 0
}
