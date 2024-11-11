import { z } from 'zod'

export const soundCloudWidgetSchema = iframeWidgetSchema.extend({})

export const soundCloudWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.SOUNDCLOUD)
  )

export type SoundCloudWidgetProperties = z.input<typeof soundCloudWidgetSchema>
