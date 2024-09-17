import type { LayoutItem } from 'grid-layout-plus'

export type LSP27TheGrid = Array<GridWidget>

export type GridWidget = {
  type: GridWidgetType
  width: number
  height: number
  properties: Record<string, any>
  id: string
}

export type GridWidgetSize = { w: number; h: number }

export type GridWidgetSizes = GridWidgetSize[]

export type GridWidgetTypeSizes = Record<GridWidgetType, GridWidgetSizes>

export enum GridWidgetType {
  TITLE_LINK = 'TITLE_LINK',
  TEXT = 'TEXT',
  X_POST = 'X_POST',
  X_TIMELINE = 'X_TIMELINE',
  INSTAGRAM_POST = 'INSTAGRAM_POST',
  IMAGE = 'IMAGE',
  IFRAME = 'IFRAME',
}

// This class is compatible with the grid-layout-plus library
// And enhances it with the properties used for our grid layout
export type GridLayoutItem = LayoutItem & GridWidget

export interface Property {
  key: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'url'
  optional?: boolean
}

// To programmatically generate the form based on the widget type
// TODO: Once we have the tools to parse widget properties from embed code some of this might change
export const WIDGET_TYPE_PROPERTIES: Record<GridWidgetType, Property[]> = {
  [GridWidgetType.TITLE_LINK]: [
    { key: 'title', type: 'string' },
    { key: 'src', type: 'url', optional: true },
    { key: 'textColor', type: 'color', optional: true },
    { key: 'bgColor', type: 'color', optional: true },
  ],
  [GridWidgetType.TEXT]: [
    { key: 'title', type: 'string' },
    { key: 'text', type: 'string' },
    { key: 'bgColor', type: 'color', optional: true },
  ],
  [GridWidgetType.X_POST]: [{ key: 'src', type: 'string' }],
  [GridWidgetType.X_TIMELINE]: [{ key: 'src', type: 'url' }],
  [GridWidgetType.INSTAGRAM_POST]: [],
  [GridWidgetType.IFRAME]: [
    { key: 'src', type: 'url' },
    { key: 'title', type: 'string' },
    { key: 'allow', type: 'string' },
  ],
  [GridWidgetType.IMAGE]: [{ key: 'src', type: 'url' }],
}
