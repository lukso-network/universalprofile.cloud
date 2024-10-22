/**
 * Create a unique id for a grid item based on title
 *
 * @param gridItem
 * @param config
 * @returns
 */
export const createGridId = <T>(
  gridItem: PartialBy<Grid<T>, 'id' | 'grid'>,
  config: Grid<GridWidgetWithoutCords>[] | Grid<GridWidget>[]
): string => {
  // generate id based on title using slug() util
  // look in config if title exist, if title is not unique, add a number to the end

  const baseId = slug(gridItem.title)
  let uniqueId = baseId
  let counter = 0

  while (config.some(item => item.id === uniqueId)) {
    uniqueId = `${baseId}-${counter}`
    counter++
  }

  return uniqueId
}
