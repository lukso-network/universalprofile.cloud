/**
 * Convert grid layout to LSP27 config
 *
 * @param layout
 * @returns
 */
export const layoutToConfig = (
  _layout: Grid<GridWidget>[]
): PartialBy<Grid<GridConfigItem>, 'id'>[] => {
  const convertGrid = (layout: GridWidget[]): GridConfigItem[] => {
    // remove "add content" widget from layout before saving
    const layoutWithoutAddContentWidget = layout.filter(
      item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
    )

    // sort by y and then x to get the correct order
    const orderedLayout = layoutWithoutAddContentWidget.sort((a, b) => {
      if (a.y === b.y) {
        return a.x - b.x
      }

      return a.y - b.y
    })

    return orderedLayout.map(item => {
      return {
        type: item.type,
        width: item.originalWidth || item.w,
        height: item.h,
        properties: item.properties,
      }
    })
  }

  return _layout.map(item => {
    return {
      title: item.title,
      grid: convertGrid(item.grid),
    }
  })
}
