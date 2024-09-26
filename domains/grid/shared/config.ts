export const COL_NUM_LARGE = 2
export const COL_NUM_SMALL = 1

export const breakpoints: Record<number, number> = {
  0: COL_NUM_SMALL,
  768: COL_NUM_LARGE,
}

export enum GRID_WIDGET_TYPE {
  // custom
  TITLE_LINK = 'TITLE_LINK',
  TEXT = 'TEXT',
  IFRAME = 'IFRAME',
  IMAGE = 'IMAGE',

  // social media
  X = 'X',
  INSTAGRAM = 'INSTAGRAM',

  // music
  SPOTIFY = 'SPOTIFY',
  SOUNDCLOUD = 'SOUNDCLOUD',

  // video
  YOUTUBE = 'YOUTUBE',

  // static widgets for visual purposes
  ADD_WIDGET = 'ADD_WIDGET',
}

export const WIDGET_TYPE_PROPERTIES: Record<
  GridWidgetType,
  GridWidgetProperty[]
> = {
  [GRID_WIDGET_TYPE.TITLE_LINK]: [
    { key: 'title', type: 'string' },
    { key: 'src', type: 'url', optional: true },
    { key: 'textColor', type: 'color', optional: true },
    { key: 'bgColor', type: 'color', optional: true },
  ],
  [GRID_WIDGET_TYPE.TEXT]: [
    { key: 'title', type: 'string' },
    { key: 'text', type: 'string' },
    { key: 'bgColor', type: 'color', optional: true },
  ],
  [GRID_WIDGET_TYPE.X]: [
    { key: 'src', type: 'url' },
    { key: 'embedType', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.INSTAGRAM]: [],
  [GRID_WIDGET_TYPE.IFRAME]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.IMAGE]: [{ key: 'src', type: 'url' }],
  [GRID_WIDGET_TYPE.ADD_WIDGET]: [],
  [GRID_WIDGET_TYPE.YOUTUBE]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.SPOTIFY]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
  [GRID_WIDGET_TYPE.SOUNDCLOUD]: [
    { key: 'src', type: 'url' },
    { key: 'allow', type: 'string' },
  ],
}
