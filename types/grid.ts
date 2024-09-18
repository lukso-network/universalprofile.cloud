import type { LayoutItem } from 'grid-layout-plus'

export type LSP27TheGrid = Array<GridWidget>

export type GridWidgetType = keyof typeof GRID_WIDGET_TYPE

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

// This class is compatible with the grid-layout-plus library
// And enhances it with the properties used for our grid layout
export type GridLayoutItem = LayoutItem & GridWidget

export type Property = {
  key: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'url'
  optional?: boolean
}
