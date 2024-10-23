import { z } from 'zod'

export const youtubeWidgetSchema = z
  .object({
    src: z.string(),
    allow: z.string().optional(),
  })
  .transform((values, ctx) => parsePlatform(values, ctx, GRID_WIDGET_TYPE.X))

export type YoutubeWidgetProperties = z.infer<typeof youtubeWidgetSchema>
