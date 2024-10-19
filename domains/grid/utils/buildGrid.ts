export const buildGrid = (
  grid: Grid<GridWidgetWithoutCords>[] | Grid<GridWidget>[],
  isMobile?: boolean,
  withAddContentPlaceholder?: boolean
): Grid<GridWidget>[] => {
  const _buildGrid = (
    grid: GridWidgetWithoutCords[],
    updatedGrid: GridWidget[],
    gridColumns: number
  ) => {
    // remove "add widget" placeholder from grid
    let _grid = grid.filter(item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT)

    // if items already have x/y cords we re-order grid to reflect that
    _grid = _grid.slice().sort((a, b) => {
      if (
        a.x === undefined ||
        b.x === undefined ||
        a.y === undefined ||
        b.y === undefined
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
          type: GRID_WIDGET_TYPE.ADD_CONTENT,
          isResizable: false,
        })
      )
    }

    for (const widget of _grid) {
      placeWidgetInGrid(widget, updatedGrid, gridColumns)
    }

    return updatedGrid
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
