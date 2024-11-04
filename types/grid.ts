import type { z, ZodEffects, ZodObject } from 'zod'

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

export type GridSchemaMap = {
  input: ZodObject<any> | ZodEffects<ZodObject<any>>
  output: ZodObject<any> | ZodEffects<ZodObject<any>>
  build: ZodObject<any> | ZodEffects<ZodObject<any>>
}
