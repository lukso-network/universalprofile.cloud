import { z } from 'zod'

export const xWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string().optional(),
  })
  .transform((values, ctx) =>
    platformTransform(values, ctx, GRID_WIDGET_TYPE.enum.X)
  )

export type XWidgetProperties = z.input<typeof xWidgetSchema>
