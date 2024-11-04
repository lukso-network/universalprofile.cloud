export const buildPlatformOutput = async (
  type: GridWidgetType,
  properties: GridWidgetProperties
) => {
  switch (type) {
    case GRID_WIDGET_TYPE.enum.X:
      return xBuilder(properties as XProperties)

    default:
      return {
        src: '',
      }
  }
}
