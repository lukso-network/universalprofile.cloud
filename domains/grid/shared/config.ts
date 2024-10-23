import type { ZodEffects, ZodObject } from 'zod'

export enum GRID_WIDGET_TYPE {
  // custom
  TEXT = 'TEXT',
  IFRAME = 'IFRAME',
  IMAGE = 'IMAGE',

  // social media
  X = 'X',
  INSTAGRAM = 'INSTAGRAM',
  WARPCAST = 'WARPCAST',

  // music
  SPOTIFY = 'SPOTIFY',
  SOUNDCLOUD = 'SOUNDCLOUD',

  // video
  YOUTUBE = 'YOUTUBE',

  // static widgets for visual purposes
  ADD_CONTENT = 'ADD_CONTENT',
}

// map zod schema to widget type
export const WIDGET_SCHEMA_MAP: Partial<
  Record<GridWidgetType, ZodObject<any> | ZodEffects<ZodObject<any>>>
> = {
  [GRID_WIDGET_TYPE.TEXT]: textWidgetSchema,
  [GRID_WIDGET_TYPE.X]: xWidgetSchema,
  [GRID_WIDGET_TYPE.INSTAGRAM]: instagramWidgetSchema,
  [GRID_WIDGET_TYPE.IFRAME]: iframeWidgetSchema,
  [GRID_WIDGET_TYPE.IMAGE]: imageWidgetSchema,
  [GRID_WIDGET_TYPE.YOUTUBE]: youtubeWidgetSchema,
  [GRID_WIDGET_TYPE.SPOTIFY]: spotifyWidgetSchema,
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: soundCloudWidgetSchema,
  [GRID_WIDGET_TYPE.WARPCAST]: warpcastWidgetSchema,
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
