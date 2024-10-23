import { z } from 'zod'

export const xWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string(),
  })
  .transform((values, ctx) => parsePlatform(values, ctx, GRID_WIDGET_TYPE.X))

export type XWidgetProperties = z.infer<typeof xWidgetSchema>
