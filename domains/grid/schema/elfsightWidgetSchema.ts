import { z } from 'zod'

export const elfsightWidgetSchema = z.object({
  id: z.string(),
})

export const elfsightWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.ELFSIGHT)
  )

export type ElfsightWidgetProperties = z.input<typeof elfsightWidgetSchema>
