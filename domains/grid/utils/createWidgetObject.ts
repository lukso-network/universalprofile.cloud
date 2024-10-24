import assert from 'assert'

/**
 * Create a new widget object with default values
 *
 * @param newWidget
 * @returns
 */
export const createWidgetObject = (
  newWidget: Partial<GridWidgetWithoutCords>
): GridWidgetWithoutCords => {
  assertNotUndefined(newWidget.type, 'Widget `type` field is undefined')
  assert(newWidget.type in GRID_WIDGET_TYPE.enum, 'Invalid widget `type` filed')

  // TODO add validation for properties based on widget type

  return {
    ...newWidget,
    type: newWidget.type,
    w: newWidget.w || 1,
    h: newWidget.h || 1,
    i: newWidget.i || generateItemId(),
    properties: newWidget.properties || {},
  }
}
