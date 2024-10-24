/**
 * Update the column heights array with the new height
 *
 * @param columnHeights
 * @param x
 * @param width
 * @param newHeight
 */
export const updateColumnHeights = (
  columnHeights: number[],
  x: number,
  width: number,
  newHeight: number
): void => {
  for (let i = x; i < x + width; i++) {
    columnHeights[i] = newHeight
  }
}
