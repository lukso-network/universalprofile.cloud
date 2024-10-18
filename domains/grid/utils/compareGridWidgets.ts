/**
 * Compare two grids and return an array of changes.
 *
 * @param gridA - Old grid.
 * @param gridB - New grid.
 * @returns Array of changes.
 */
export const compareGridWidgets = (
  _gridA?: GridWidget[],
  _gridB?: GridWidget[]
): GridWidgetChange[] => {
  const result: GridWidgetChange[] = []
  const propertiesToCheck: (keyof GridWidget)[] = [
    'x',
    'y',
    'w',
    'h',
    'type',
    'properties',
  ]
  const gridA =
    _gridA?.filter(item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT) || []
  const gridB =
    _gridB?.filter(item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT) || []
  const maxLength = Math.max(gridA.length, gridB.length)

  for (let i = 0; i < maxLength; i++) {
    const oldWidget = gridA[i]
    const newWidget = gridB[i]

    if (!oldWidget) {
      result.push({ oldWidget: null, newWidget })
    } else if (!newWidget) {
      result.push({ oldWidget, newWidget: null })
    } else {
      const hasChanged = propertiesToCheck.some(prop => {
        if (prop === 'properties') {
          return !deepEqual(oldWidget[prop], newWidget[prop])
        }

        return oldWidget[prop] !== newWidget[prop]
      })

      if (hasChanged) {
        result.push({ oldWidget, newWidget })
      }
    }
  }

  return result
}
