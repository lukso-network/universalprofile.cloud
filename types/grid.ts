import type { LayoutItem } from 'grid-layout-plus'
import type { z } from 'zod'

export type Grid<T> = {
  title: string
  grid: T[]
  id: string
  gridColumns: number
}

export type GridConfigItem = {
  width: number
  height: number
  type: GridWidgetType
  properties: GridWidgetProperties
}

export type GridWidgetExtended = {
  type: GridWidgetType
  properties: GridWidgetProperties
  originalWidth?: number
}

export type GridWidget = LayoutItem & GridWidgetExtended

export type GridWidgetWithoutCords = PartialBy<GridWidget, 'x' | 'y'>

export type GridWidgetType = z.infer<typeof GRID_WIDGET_TYPE>

export type GridWidgetProperties = Record<string, any>

export type GridWidgetProperty = {
  key: string
  type: 'string' | 'number' | 'boolean' | 'color' | 'url'
  optional?: boolean
}

export type GridWidgetChange = {
  oldWidget: GridWidget | null
  newWidget: GridWidget | null
}

export type GridChange = {
  oldGrid: Grid<GridWidget>
  newGrid: Grid<GridWidget>
}
