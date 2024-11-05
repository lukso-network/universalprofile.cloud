export const buildPlatformOutput = async (
  type: GridWidgetType,
  properties: GridWidgetProperties
) => {
  switch (type) {
    case GRID_WIDGET_TYPE.enum.X:
      return xBuilder(properties as XWidgetProperties)
    case GRID_WIDGET_TYPE.enum.INSTAGRAM:
      return instagramBuilder(properties as InstagramWidgetProperties)

    default:
      return {
        src: '',
      }
  }
}
