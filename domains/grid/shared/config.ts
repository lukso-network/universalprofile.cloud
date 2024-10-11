export const DEFAULT_LARGE_COLUMN_NUMBER = 2
export const DEFAULT_SMALL_COLUMN_NUMBER = 1
export const GRID_BREAKPOINT_PX = 768

export enum GRID_WIDGET_TYPE {
  // custom
  TITLE_LINK = 'TITLE_LINK',
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

export const WIDGET_TYPE_PROPERTIES: Record<
  GridWidgetType,
  GridWidgetProperty[]
> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: [
    { key: 'title', type: 'string' },
    { key: 'src', type: 'url', optional: true },
    { key: 'textColor', type: 'color', optional: true },
    { key: 'backgroundColor', type: 'color', optional: true },
  ],
  [GRID_WIDGET_TYPE.TEXT]: [
    { key: 'title', type: 'string' },
    { key: 'text', type: 'string' },
    { key: 'titleColor', type: 'color' },
    { key: 'textColor', type: 'color' },
    { key: 'backgroundColor', type: 'color', optional: true },
  ],
  [GRID_WIDGET_TYPE.X]: [
    { key: 'src', type: 'url' },
    { key: 'type', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.INSTAGRAM]: [
    { key: 'src', type: 'url' },
    { key: 'type', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.IFRAME]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.IMAGE]: [{ key: 'src', type: 'url' }],
  [GRID_WIDGET_TYPE.ADD_CONTENT]: [],
  [GRID_WIDGET_TYPE.YOUTUBE]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.SPOTIFY]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
    { key: 'type', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.WARPCAST]: [{ key: 'src', type: 'url' }],
}

export const DEFAULT_GRID_TITLE = 'Main'
