import type { LayoutItem } from 'grid-layout-plus'

export type GridProperties = {
  isDraggable: boolean
  isResizable: boolean
  isResponsive: boolean
}

export type Widget = LayoutItem & {
  type: WidgetType
  properties?: Record<string, any>
}

// TODO: calculate w and h based on size
export enum WidgetSize {
  SMALL = 1, // 1 column, should resize to 2 if not able to fill the row
  MEDIUM = 2, // 2 columns
  LARGE = 3, // 3 columns resizes to 2 columns on mobile
  FULL = 4, // 4 columns resizes to 2 columns on mobile
}

export enum WidgetType {
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
