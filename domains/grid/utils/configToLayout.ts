import type { GridConfigItem } from '@/types/grid'

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
      id: createGridId<GridConfigItem>(gridItem, layout),
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
