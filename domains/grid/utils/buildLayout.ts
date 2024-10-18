export const buildLayout = (
  layout: Grid<GridWidgetWithoutCords>[] | Grid<GridWidget>[],
  gridColumns: number,
  withAddContentPlaceholder?: boolean
): Grid<GridWidget>[] => {
  const _buildLayout = (
    layout: GridWidgetWithoutCords[],
    updatedLayout: GridWidget[]
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
    return {
      id: item.id,
      title: item.title,
      grid: _buildLayout(item.grid, updatedLayout),
    }
  })
}
