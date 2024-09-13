import type { LayoutItem } from 'grid-layout-plus'

export type LSP27TheGrid = Array<GridWidget>

export type GridWidget = {
  type: GridWidgetType
  width: number
  height: number
  properties: Record<string, any>
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
export type GridLayoutItem = GridWidget & LayoutItem
