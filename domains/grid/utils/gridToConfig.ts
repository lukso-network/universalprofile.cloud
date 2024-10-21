/**
 * Convert grid to LSP27 config
 *
 * @param _grid
 */
export const gridToConfig = (
  _grid: Grid<GridWidget>[]
): PartialBy<Grid<GridConfigItem>, 'id'>[] => {
  const convertGrid = (grid: GridWidget[]): GridConfigItem[] => {
    // remove "add content" widget from grid before saving
    const gridWithoutAddContentWidget = grid.filter(
      item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
    )

    // sort by y and then x to get the correct order
    const orderedGrid = gridWithoutAddContentWidget.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x
      }

      return a.y - b.y
    })

    return orderedGrid.map(item => {
      return {
        type: item.type,
        width: item.originalWidth || item.w,
        height: item.h,
        properties: item.properties,
      }
    })
  }

  return _grid.map(item => {
    return {
      title: item.title,
      grid: convertGrid(item.grid),
      gridColumns: item.gridColumns,
    }
  })
}
