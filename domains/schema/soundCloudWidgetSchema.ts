import { z } from 'zod'

export const soundCloudWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string(),
    allow: z.string().optional(),
  })
  .transform((values, ctx) =>
    parsePlatform(values, ctx, GRID_WIDGET_TYPE.enum.X)
  )

export type SoundCloudWidgetProperties = z.infer<typeof soundCloudWidgetSchema>
