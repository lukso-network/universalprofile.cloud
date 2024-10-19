import type { GridConfigItem } from '@/types/grid'

/**
 * Convert Grid config to Grid layout
 *
 * @param config
 * @param columns
 */
export const configToGrid = (
  config: PartialBy<Grid<GridConfigItem>, 'id'>[]
): Grid<GridWidgetWithoutCords>[] => {
  const grid: Grid<GridWidgetWithoutCords>[] = []

  for (const gridItem of config) {
    grid.push({
      id: createGridId<GridConfigItem>(gridItem, grid),
      title: gridItem.title,
      grid: gridItem.grid.map(widget => {
        return createWidgetObject({
          type: widget.type,
          properties: widget.properties,
          w: widget.width,
          h: widget.height,
        })
      }),
      gridColumns: getGridColumns(gridItem.gridColumns),
    })
  }

  return grid
}

/**
 * Get grid column number
 *
 * @param gridColumns
 */
const getGridColumns = (gridColumns?: number): number => {
  if (!gridColumns) {
    return GRID_COLUMNS_MIN
  }

  return gridColumns
}
