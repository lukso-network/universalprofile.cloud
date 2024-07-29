/**
 * Sorts an array of strings by the given order.
 *
 * @param a
 * @param b
 * @param order
 * @returns
 */
export const stringSort = (valueA?: string, valueB?: string, order = 'asc') => {
  const compare =
    order === 'asc'
      ? valueA?.trimStart()?.localeCompare(valueB?.trimStart() || '')
      : valueB?.trimStart()?.localeCompare(valueA?.trimStart() || '')

  return compare ?? 0
}
