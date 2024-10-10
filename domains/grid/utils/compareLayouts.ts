/**
 * Compare two grid layouts and return an array of changes.
 *
 * @param layoutA - Old grid layout.
 * @param layoutB - New grid layout.
 * @returns Array of changes.
 */
export const compareLayouts = (
  _layoutA: GridWidget[],
  _layoutB: GridWidget[]
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
  const layoutA = _layoutA.filter(
    item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
  )
  const layoutB = _layoutB.filter(
    item => item.type !== GRID_WIDGET_TYPE.ADD_CONTENT
  )
  const maxLength = Math.max(layoutA.length, layoutB.length)

  for (let i = 0; i < maxLength; i++) {
    const oldWidget = layoutA[i]
    const newWidget = layoutB[i]

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
