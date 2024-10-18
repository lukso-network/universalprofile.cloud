export const buildLayout = (
  layout: Grid<GridWidgetWithoutCords>[] | Grid<GridWidget>[],
  isMobile?: boolean,
  withAddContentPlaceholder?: boolean
): Grid<GridWidget>[] => {
  const _buildLayout = (
    layout: GridWidgetWithoutCords[],
    updatedLayout: GridWidget[],
    gridColumns: number
  ) => {
    // remove "add widget" placeholder from layout
    let _layout = layout.filter(
      item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
    )

    // if items already have x/y cords we re-order layout to reflect that
    _layout = _layout.slice().sort((a, b) => {
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
      _layout.push(
        createWidgetObject({
          i: 'placeholder',
          type: GRID_WIDGET_TYPE.ADD_CONTENT,
          isResizable: false,
        })
      )
    }

    for (const widget of _layout) {
      placeWidgetInLayout(widget, updatedLayout, gridColumns)
    }

    return updatedLayout
  }

  return layout.map(item => {
    const updatedLayout: GridWidget[] = []
    const gridColumns = getGridColumns(item.gridColumns)
    return {
      id: item.id,
      title: item.title,
      grid: _buildLayout(
        item.grid,
        updatedLayout,
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
