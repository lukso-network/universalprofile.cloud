import type { ZodObject } from 'zod'

export const widgetSchemaMap: Partial<Record<GridWidgetType, ZodObject<any>>> =
  {
    [GRID_WIDGET_TYPE.TEXT]: textWidgetSchema,
    // [GRID_WIDGET_TYPE.X]: xWidgetSchema
    // [GRID_WIDGET_TYPE.INSTAGRAM]: instagramWidgetSchema
    [GRID_WIDGET_TYPE.IFRAME]: iframeWidgetSchema,
    [GRID_WIDGET_TYPE.IMAGE]: imageWidgetSchema,
    // [GRID_WIDGET_TYPE.ADD_CONTENT]: addContentWidgetSchema
    // [GRID_WIDGET_TYPE.YOUTUBE]: youtubeWidgetSchema
    // [GRID_WIDGET_TYPE.SPOTIFY]: spotifyWidgetSchema
    // [GRID_WIDGET_TYPE.SOUNDCLOUD]: soundcloudWidgetSchema
    // [GRID_WIDGET_TYPE.WARPCAST]: warpcastWidgetSchema
  }
