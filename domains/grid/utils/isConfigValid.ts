/**
 *  Check if the grid config is valid
 *
 * @param grid
 * @returns
 */
export function isConfigValid(gridConfig?: any): boolean {
  if (!Array.isArray(gridConfig)) {
    return false
  }

  if (gridConfig.length === 0) {
    return true
  }

  for (const item of gridConfig) {
    if (typeof item.title !== 'string') {
      return false
    }

    if (!Array.isArray(item.grid)) {
      return false
    }

    for (const gridItem of item.grid) {
      if (
        !Object.values(GRID_WIDGET_TYPE.enum).includes(gridItem.type) ||
        typeof gridItem.width !== 'number' ||
        typeof gridItem.height !== 'number' ||
        typeof gridItem.properties !== 'object'
      ) {
        return false
      }
    }
  }

  return true
}
