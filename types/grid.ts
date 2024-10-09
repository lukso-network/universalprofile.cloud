import type { LayoutItem } from 'grid-layout-plus'

export type Grid<T> = {
  title: string
  grid: T[]
  id: string
}

export type GridConfigItem = {
  width: number
  height: number
  type: GridWidgetType
  properties: Record<string, any>
}

export type LayoutItemExtended = {
  type: GridWidgetType
  properties: Record<string, any>
  originalWidth?: number
}

export type GridWidget = LayoutItem & LayoutItemExtended

export type GridWidgetWithoutCords = PartialBy<GridWidget, 'x' | 'y'>

export type GridWidgetType = keyof typeof GRID_WIDGET_TYPE

export type GridWidgetProperty = {
  key: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'url'
  optional?: boolean
}

export type GridWidgetChange = {
  oldWidget: GridWidget | null
  newWidget: GridWidget | null
}
