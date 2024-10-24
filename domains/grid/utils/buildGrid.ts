export const buildGrid = (
  grid: Grid[],
  isMobile?: boolean,
  withAddContentPlaceholder?: boolean
): Grid[] => {
  const _buildGrid = (
    gridWidgets: GridWidget[],
    updatedGridWidgets: GridWidget[],
    gridColumns: number
  ) => {
    // remove "add widget" placeholder from grid
    let _grid = gridWidgets.filter(
      item => item.type !== GRID_WIDGET_TYPE.enum.ADD_CONTENT
    )

    // if items already have x/y cords we re-order grid to reflect that
    _grid = _grid.slice().sort((a, b) => {
      if (
        typeof a.x !== 'number' ||
        typeof a.y !== 'number' ||
        typeof b.x !== 'number' ||
        typeof b.y !== 'number'
      ) {
        return 0
      }

      if (a.y === b.y) {
        return a.x - b.x
      }

      return a.y - b.y
    })

    // re-add placeholder
    if (withAddContentPlaceholder) {
      _grid.push(
        createWidgetObject({
          i: 'placeholder',
          type: GRID_WIDGET_TYPE.enum.ADD_CONTENT,
          isResizable: false,
        }) as GridWidget
      )
    }

    for (const widget of _grid) {
      placeWidgetInGrid(widget, updatedGridWidgets, gridColumns)
    }

    return updatedGridWidgets
  }

  return grid.map(item => {
    const updatedGrid: GridWidget[] = []
    const gridColumns = getGridColumns(item.gridColumns)
    return {
      id: item.id,
      title: item.title,
      grid: _buildGrid(
        item.grid,
        updatedGrid,
        isMobile ? DEFAULT_SMALL_COLUMN_NUMBER : gridColumns
      ),
      gridColumns,
    }
  })
}

const getGridColumns = (gridColumns?: number) => {
  if (!gridColumns) {
    return GRID_COLUMNS_MIN
  }

  if (gridColumns > GRID_COLUMNS_MAX) {
    return GRID_COLUMNS_MAX
  }

  return gridColumns
}
