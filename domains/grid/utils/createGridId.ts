/**
 * Create a unique id for a grid item based on title
 *
 * @param gridItem
 * @param grid
 */
export const createGridId = (
  gridItem: Partial<GridConfig | Grid>,
  grid: Grid[]
): string => {
  const baseId = slug(gridItem?.title)
  let uniqueId = baseId
  let counter = 0

  while (grid.some(item => item.id === uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }

  return uniqueId
}
