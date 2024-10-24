import { z } from 'zod'

export const gridConfigWidgetSchema = z.object({
  width: z.number().default(1),
  height: z.number().default(1),
  type: GRID_WIDGET_TYPE,
  properties: gridWidgetProperties,
})

export const gridConfigSchema = z.object({
  title: z.string().default(DEFAULT_GRID_TITLE),
  grid: z.array(gridConfigWidgetSchema).default([]),
  gridColumns: z.number().default(GRID_COLUMNS_MIN),
})

export type GridConfigWidget = z.input<typeof gridConfigWidgetSchema>
export type GridConfig = z.input<typeof gridConfigSchema>
