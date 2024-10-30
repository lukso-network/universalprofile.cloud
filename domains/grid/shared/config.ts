import { type ZodEffects, type ZodObject, z } from 'zod'

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
export const WIDGET_SCHEMA_MAP: Partial<
  Record<GridWidgetType, ZodObject<any> | ZodEffects<ZodObject<any>>>
> = {
  [GRID_WIDGET_TYPE.enum.TEXT]: textWidgetSchema,
  [GRID_WIDGET_TYPE.enum.X]: xWidgetSchema,
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
  [GRID_WIDGET_TYPE.enum.X]: {
    type: GRID_WIDGET_TYPE.enum.X,
    embedRegex:
      /https?:\/\/twitter\.com\/(?<handle>[a-zA-Z0-9_]+)(?:\/status\/(?<id>\d+))?(?:\?[^"'\s]*)?/,
    secondaryRegexesWithCallbacks: [
      // Match a handle with @ symbol
      {
        regex: /@([a-zA-Z0-9_]{1,15})/,
        callback: getXOEmbedFromHandle,
      },
      // Match a Twitter URL with or without https www and status
      {
        regex:
          /(https?:\/\/)?(?:x\.com|twitter\.com)\/[a-zA-Z0-9_]+(?:\/status\/(\d+))?/,
        callback: async url => sanitizeXEmbedUrl(url),
      },
    ],
  },
  [GRID_WIDGET_TYPE.enum.INSTAGRAM]: {
    type: GRID_WIDGET_TYPE.enum.INSTAGRAM,
    embedRegex:
      /https:\/\/www\.instagram\.com\/(?<type>p|reel|profile|tv)\/(?<id>[\w-]+)\/(?<params>\?[^"]*)?/,
  },
  [GRID_WIDGET_TYPE.enum.SPOTIFY]: {
    type: GRID_WIDGET_TYPE.enum.IFRAME,
    embedRegex:
      /https?:\/\/(?:open\.)?spotify\.com\/embed\/?(?<type>track|playlist|artist)\/(?<id>[^?]+)(?:\?utm_source=(?:generator|oembed))?(?:&theme=(?<theme>\d))?/,
    secondaryRegexesWithCallbacks: [
      {
        regex:
          /https:\/\/open\.spotify\.com\/(?<type>track|playlist|artist)\/(?<id>[^?]+)/,
        callback: getSpotifyOEmbed,
      },
    ],
    constantProperties: {
      allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.enum.SOUNDCLOUD]: {
    type: GRID_WIDGET_TYPE.enum.IFRAME,
    embedRegex:
      /https?:\/\/w\.soundcloud\.com\/player\/\?(?:(?!url=https).)*url=https(?::|%3A)(?:\/|%2F){2}api\.soundcloud\.com(?:\/|%2F)(?<type>tracks|playlists|users)(?:\/|%2F)\d+(?:[^"]*)?/,
    secondaryRegexesWithCallbacks: [
      {
        regex:
          /https:\/\/soundcloud\.com\/([a-zA-Z0-9_-]+)(?:\/(sets\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+))?\/?/,
        callback: getSoundCloudOEmbed,
      },
    ],
    constantProperties: {
      allow: 'clipboard-write; encrypted-media; fullscreen; picture-in-picture',
    },
  },
  [GRID_WIDGET_TYPE.enum.YOUTUBE]: {
    type: GRID_WIDGET_TYPE.enum.YOUTUBE,
    embedRegex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
    secondaryRegexesWithCallbacks: [
      {
        regex: /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
        callback: async url => sanitizeYoutubeEmbedUrl(url),
      },
    ],
    constantProperties: {
      allow:
        'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    },
  },
}
