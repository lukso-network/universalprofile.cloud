import { z } from 'zod'

export const gridWidgetProperties = z.union([
  iframeWidgetSchema,
  imageWidgetSchema,
  textWidgetSchema,
  instagramWidgetSchema,
  soundCloudWidgetSchema,
  spotifyWidgetSchema,
  warpcastWidgetSchema,
  xOutputSchema,
  youtubeWidgetSchema,
])

export const gridWidgetSchema = z.object({
  w: z.number().positive(),
  h: z.number().positive(),
  x: z.number().positive(),
  y: z.number().positive(),
  i: z.string().or(z.number()),
  type: GRID_WIDGET_TYPE,
  originalWidth: z.number().optional(),
  properties: gridWidgetProperties.or(z.object({})),
  isResizable: z.boolean().optional(),
  isDraggable: z.boolean().optional(),
  static: z.boolean().optional(),
})

export const gridWidgetWithoutCordsSchema = gridWidgetSchema.omit({
  x: true,
  y: true,
})

export const gridSchema = z.object({
  title: z.string(),
  grid: z.array(gridWidgetSchema),
  gridColumns: z.number(),
  id: z.string(),
})

export type GridWidget = z.input<typeof gridWidgetSchema>
export type GridWidgetWithoutCords = z.input<
  typeof gridWidgetWithoutCordsSchema
>
export type Grid = z.input<typeof gridSchema>
export type GridWidgetProperties = z.input<typeof gridWidgetProperties>
