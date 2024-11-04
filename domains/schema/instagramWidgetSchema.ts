import { z } from 'zod'

export const instagramWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string().optional(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values, ctx, GRID_WIDGET_TYPE.enum.INSTAGRAM)
  )

export type InstagramWidgetProperties = z.input<typeof instagramWidgetSchema>
