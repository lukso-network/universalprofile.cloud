/**
 * Split an array into batches of a specified size
 *
 * @param array
 * @param size
 * @returns
 */
export const splitArray = (array: any[], size: number) => {
  const batches: any[][] = []

  while (array.length) {
    batches.push(array.splice(0, size))
  }

  return batches
}
