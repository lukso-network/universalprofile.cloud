import { z } from 'zod'

export const youtubeWidgetSchema = z
  .object({
    src: z.string(),
    allow: z.string().optional(),
  })
  .transform((values, ctx) =>
    platformTransform(values, ctx, GRID_WIDGET_TYPE.enum.YOUTUBE)
  )

export type YoutubeWidgetProperties = z.input<typeof youtubeWidgetSchema>
