import type { LayoutItem } from 'grid-layout-plus'

export type GridProperties = {
  isDraggable: boolean
  isResizable: boolean
  isResponsive: boolean
}

export type GridWidget = {
  position: number;
  type: GridWidgetType;
  size: GridWidgetSize;
  properties?: Record<string, any>;
}

export enum GridWidgetSize {
  SMALL,
  MEDIUM,
  LARGE,
  FULL
}

export type GridWidgetSizeWH = {
  w: number;
  h: number;
}

export type GridWidgetSizes = Record<GridWidgetSize, GridWidgetSizeWH | undefined>;

export type GridWidgetTypeSizes = Record<GridWidgetType, GridWidgetSizes>;

export enum GridWidgetType {
  TITLE_LINK = 'TITLE_LINK',
  TEXT = 'TEXT',
  X_POST = 'X_POST',
  X_TIMELINE = 'X_TIMELINE',
  INSTAGRAM_POST = 'INSTAGRAM_POST',
  IMAGE = 'IMAGE',
  // This should not be exposed as a tool to the user
  // But can be used internally to display any page that accepts iframe embeds
  // Eg: Youtube, Google Maps, Spotify, etc
  IFRAME = 'IFRAME',
}

export const GRID_WIDGET_TYPES_SIZES: GridWidgetTypeSizes = {
  [GridWidgetType.TITLE_LINK]: {
    [GridWidgetSize.SMALL]: { w: 1, h: 5 },
    [GridWidgetSize.MEDIUM]: { w: 2, h: 5 },
    [GridWidgetSize.LARGE]: { w: 3, h: 5 },
    [GridWidgetSize.FULL]: { w: 4, h: 5 }
  },
  [GridWidgetType.TEXT]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w: 2, h: 10 },
    [GridWidgetSize.LARGE]: { w: 3, h: 10 },
    [GridWidgetSize.FULL]: { w: 4, h: 10 }
  },
  [GridWidgetType.X_POST]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w: 2, h: 20 },
    [GridWidgetSize.LARGE]: undefined,
    [GridWidgetSize.FULL]: undefined
  },
  [GridWidgetType.X_TIMELINE]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w: 2, h: 20 },
    [GridWidgetSize.LARGE]: undefined,
    [GridWidgetSize.FULL]: undefined
  },
  [GridWidgetType.INSTAGRAM_POST]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w: 2, h: 20 },
    [GridWidgetSize.LARGE]: undefined,
    [GridWidgetSize.FULL]: undefined
  },
  [GridWidgetType.IMAGE]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w:2, h: 10 },
    [GridWidgetSize.LARGE]: { w: 3, h: 15 },
    [GridWidgetSize.FULL]: { w: 4, h: 20 }
  },
  [GridWidgetType.IFRAME]: {
    [GridWidgetSize.SMALL]: undefined,
    [GridWidgetSize.MEDIUM]: { w: 2, h: 20 },
    [GridWidgetSize.LARGE]: undefined,
    [GridWidgetSize.FULL]: undefined
  }
}

// This class is compatible with the grid-layout-plus library
// And enhances it with the properties used for our grid layout
export type GridLayoutItem = 
  GridWidget & LayoutItem
