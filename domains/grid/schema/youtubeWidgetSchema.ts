import { z } from 'zod'

export const youtubeWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
})

export const youtubeInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform(
    async (values, ctx) =>
      await platformParseTransform(
        values.input,
        ctx,
        GRID_WIDGET_TYPE.enum.YOUTUBE
      )
  )

export type YoutubeWidgetProperties = z.input<typeof youtubeWidgetSchema>
