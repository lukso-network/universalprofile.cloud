/**
 * Find the best position for a widget in the grid
 *
 * @param widget
 * @param columnHeights
 * @param gridColumns
 */
export const findBestPosition = (
  widget: GridWidgetWithoutCords,
  columnHeights: number[],
  gridColumns: number
): { x: number; y: number } => {
  let bestY = Number.MAX_SAFE_INTEGER
  let bestX = 0

  // Iterate to strictly find left-to-right placement
  for (let x = 0; x <= gridColumns - widget.w; x++) {
    const maxY = Math.max(...columnHeights.slice(x, x + widget.w))

    // Find the earliest leftmost column available
    if (maxY < bestY || (maxY === bestY && x < bestX)) {
      bestY = maxY
      bestX = x
    }
  }

  return { x: bestX, y: bestY }
}
