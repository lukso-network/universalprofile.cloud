/**
 * Get the heights of each column in a grid
 *
 * @param grid
 * @param gridColumns
 */
export const getColumnHeightsFromGrid = (
  grid: GridWidget[],
  gridColumns: number
): number[] => {
  const columnHeights = Array(gridColumns).fill(0)

  // Filter widgets that impact column heights most
  const sortedWidgets = grid.slice().sort((a, b) => b.y + b.h - (a.y + a.h))

  // Iterate through the sorted widgets until all columns are covered
  for (const widget of sortedWidgets) {
    for (let x = widget.x; x < widget.x + widget.w; x++) {
      if (columnHeights[x] < widget.y + widget.h) {
        columnHeights[x] = widget.y + widget.h
      }
    }

    // Early exit if all columns have been covered
    if (Math.min(...columnHeights) > 0) break
  }

  return columnHeights
}
