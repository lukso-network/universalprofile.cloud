import { z } from 'zod'

export const instagramWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string(),
  })
  .transform((values, ctx) =>
    parsePlatform(values, ctx, GRID_WIDGET_TYPE.enum.INSTAGRAM)
  )

export type InstagramWidgetProperties = z.infer<typeof instagramWidgetSchema>
