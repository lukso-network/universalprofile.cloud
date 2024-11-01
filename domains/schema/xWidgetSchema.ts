import { z } from 'zod'

export const xWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string(),
    username: z.string(),
    id: z.string().optional(),
    theme: z.string().optional(),
    language: z.string().optional(),
    doNotTrack: z.boolean().optional(),
  })
  .transform((values, ctx) =>
    platformTransform(values, ctx, GRID_WIDGET_TYPE.enum.X)
  )

export type XWidgetProperties = z.input<typeof xWidgetSchema>
