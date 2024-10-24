/**
 * Convert Grid config to Grid layout
 *
 * @param config
 */
export const configToGrid = (config: GridConfig[]): Grid[] => {
  const grid: Grid[] = []

  for (const configItem of config) {
    grid.push({
      id: createGridId(configItem, grid),
      title: configItem.title || DEFAULT_GRID_TITLE,
      grid:
        configItem.grid?.map(widget => {
          return createWidgetObject({
            type: widget.type,
            properties: widget.properties,
            w: widget.width,
            h: widget.height,
          }) as GridWidget
        }) || [],
      gridColumns: getGridColumns(configItem.gridColumns),
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
