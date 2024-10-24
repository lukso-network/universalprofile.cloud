/**
 * Place a widget in a grid
 *
 * @param widget
 * @param grid
 * @param gridColumns
 */
export const placeWidgetInGrid = (
  widget: GridWidgetWithoutCords,
  gridWidgets: GridWidget[],
  gridColumns: number
): void => {
  const columnHeights = getColumnHeightsFromGrid(gridWidgets, gridColumns)
  const w = Math.min(widget.w, gridColumns)

  const { x, y } = findBestPosition(
    { ...widget, w },
    columnHeights,
    gridColumns
  )

  const newWidget: GridWidget = {
    ...widget,
    x,
    y,
    w,
    originalWidth: w < widget.w ? widget.w : undefined,
  }

  gridWidgets.push(newWidget)
}
