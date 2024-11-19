import { z } from 'zod'

export const iframelyWidgetSchema = z.object({
  url: z.string(),
  iframelyUrl: z.string(),
})

export const iframelyWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.IFRAMELY)
  )

export type IframelyWidgetProperties = z.input<typeof iframelyWidgetSchema>
