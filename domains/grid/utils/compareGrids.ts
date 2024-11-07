/**
 * Compare two grids and return the changes
 *
 * @param gridA
 * @param gridB
 * @returns
 */
export const compareGrids = (gridA: Grid[], gridB: Grid[]): GridChange[] => {
  const result: GridChange[] = []
  const maxLength = Math.max(gridA.length, gridB.length)

  for (let i = 0; i < maxLength; i++) {
    const oldGrid = gridA[i] as Grid | undefined
    const newGrid = gridB[i] as Grid | undefined

    // compare differences in title or grid array
    const comparedWidgets = compareGridWidgets(oldGrid?.grid, newGrid?.grid)

    if (
      oldGrid?.title !== newGrid?.title ||
      comparedWidgets.length > 0 ||
      oldGrid?.gridColumns !== newGrid?.gridColumns
    ) {
      result.push({
        oldGrid: gridA[i],
        newGrid: gridB[i],
      })
    }
  }

  if (gridLog.enabled && result.length > 0) {
    gridLog('Unsaved grid changes', toRaw(result))
  }

  return result
}
