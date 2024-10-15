/**
 * Compare two grids and return the changes
 *
 * @param gridA
 * @param gridB
 * @returns
 */
export const compareGrids = (
  gridA: Grid<GridWidget>[],
  gridB: Grid<GridWidget>[]
): GridChange[] => {
  const result: GridChange[] = []
  const maxLength = Math.max(gridA.length, gridB.length)

  for (let i = 0; i < maxLength; i++) {
    const oldGrid = gridA[i] as Grid<GridWidget> | undefined
    const newGrid = gridB[i] as Grid<GridWidget> | undefined

    // compare differences in title or grid array
    const comparedWidgets = compareLayouts(oldGrid?.grid, newGrid?.grid)
    if (oldGrid?.title !== newGrid?.title || comparedWidgets.length > 0) {
      result.push({
        oldGrid: gridA[i],
        newGrid: gridB[i],
      })
    }
  }

  return result
}
