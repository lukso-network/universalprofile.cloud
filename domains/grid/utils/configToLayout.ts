/**
 * Convert Grid config to Grid layout
 *
 * @param config
 * @param columns
 * @returns
 */
export const configToLayout = (
  config: PartialBy<Grid<GridConfigItem>, 'id'>[]
): Grid<GridWidgetWithoutCords>[] => {
  const layout: Grid<GridWidgetWithoutCords>[] = []

  for (const gridItem of config) {
    layout.push({
      id: _createId(gridItem, layout),
      title: gridItem.title,
      grid: gridItem.grid.map(widget => {
        return createWidgetObject({
          type: widget.type,
          properties: widget.properties,
          w: widget.width,
          h: widget.height,
        })
      }),
    })
  }

  return layout
}

const _createId = (
  gridItem: PartialBy<Grid<GridConfigItem>, 'id'>,
  config: Grid<GridWidgetWithoutCords>[]
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
