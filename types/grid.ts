import type { z } from 'zod'

// TODO refactor parser into zod schema
export type GridWidgetExtended = {
  type: GridWidgetType
  properties: Record<string, any>
  originalWidth?: number
}

export type GridWidgetType = z.input<typeof GRID_WIDGET_TYPE>

export type GridWidgetChange = {
  oldWidget: GridWidget | null
  newWidget: GridWidget | null
}

export type GridChange = {
  oldGrid: Grid
  newGrid: Grid
}
