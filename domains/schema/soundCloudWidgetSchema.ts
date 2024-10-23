import { z } from 'zod'

export const soundCloudWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string().optional(),
    allow: z.string().optional(),
  })
  .transform((values, ctx) =>
    platformTransform(values, ctx, GRID_WIDGET_TYPE.enum.SOUNDCLOUD)
  )

export type SoundCloudWidgetProperties = z.infer<typeof soundCloudWidgetSchema>
