import { z } from 'zod'

export const GRID_WIDGET_TYPE = z.enum([
  // custom
  'TEXT',
  'IFRAME',
  'IMAGE',

  // social media
  'X',
  'INSTAGRAM',
  'WARPCAST',

  // music
  'SPOTIFY',
  'SOUNDCLOUD',

  // video
  'YOUTUBE',

  // static widgets for visual purposes
  'ADD_CONTENT',
])

// map zod schema to widget type
export const WIDGET_SCHEMA_MAP: Partial<Record<GridWidgetType, any>> = {
  [GRID_WIDGET_TYPE.enum.TEXT]: textWidgetSchema,
  [GRID_WIDGET_TYPE.enum.X]: {
    input: xInputSchema,
    output: xOutputSchema,
  },
  [GRID_WIDGET_TYPE.enum.INSTAGRAM]: instagramWidgetSchema,
  [GRID_WIDGET_TYPE.enum.IFRAME]: iframeWidgetSchema,
  [GRID_WIDGET_TYPE.enum.IMAGE]: imageWidgetSchema,
  [GRID_WIDGET_TYPE.enum.YOUTUBE]: youtubeWidgetSchema,
  [GRID_WIDGET_TYPE.enum.SPOTIFY]: spotifyWidgetSchema,
  [GRID_WIDGET_TYPE.enum.SOUNDCLOUD]: soundCloudWidgetSchema,
  [GRID_WIDGET_TYPE.enum.WARPCAST]: warpcastWidgetSchema,
}

// grid breakpoint where the grid switches into mobile mode
export const GRID_BREAKPOINT_PX = 768

// default title for the grid, this usually is the title of the first grid
export const DEFAULT_GRID_TITLE = 'Main'

// debounce timeout for grid resize handler
export const GRID_RESIZE_DEBOUNCE_TIMEOUT_MS = 250

// margin between columns and rows
export const GRID_SPACING_PX = 16

// default row height ratio based on the column width.
// 0.75 represents popular 4:3 aspect ratio
export const DEFAULT_GRID_ROW_HEIGHT_RATIO = 0.75

// maximum rotation angle in degrees for a widget while moving
export const MAX_WIDGET_ROTATE_WHILE_MOVE_DEG = 20

// default number of columns in "small" mode
export const DEFAULT_SMALL_COLUMN_NUMBER = 1

// minimum and maximum number of columns in the grid
export const GRID_COLUMNS_MIN = 2
export const GRID_COLUMNS_MAX = 4

// TODO instead of this huge object we should break down into individual parser files
export const PLATFORM_PARSING_PARAMETERS: Partial<
  Record<GridWidgetType, PlatformParsingParameters | undefined>
> = {
  [GRID_WIDGET_TYPE.enum.X]: PLATFORM_PARSING_PARAMETERS_X,
  [GRID_WIDGET_TYPE.enum.INSTAGRAM]: PLATFORM_PARSING_PARAMETERS_INSTAGRAM,
  [GRID_WIDGET_TYPE.enum.SPOTIFY]: PLATFORM_PARSING_PARAMETERS_SPOTIFY,
  [GRID_WIDGET_TYPE.enum.SOUNDCLOUD]: PLATFORM_PARSING_PARAMETERS_SOUNDCLOUD,
  [GRID_WIDGET_TYPE.enum.YOUTUBE]: PLATFORM_PARSING_PARAMETERS_YOUTUBE,
}
