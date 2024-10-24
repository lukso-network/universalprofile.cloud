import { z } from 'zod'

export const gridConfigWidgetSchema = z.object({
  width: z.number(),
  height: z.number(),
  type: GRID_WIDGET_TYPE,
  properties: gridWidgetProperties,
})

export const gridConfigSchema = z.object({
  title: z.string(),
  grid: z.array(gridConfigWidgetSchema),
  gridColumns: z.number(),
})

export type GridConfigWidget = z.input<typeof gridConfigWidgetSchema>
export type GridConfig = z.input<typeof gridConfigSchema>
