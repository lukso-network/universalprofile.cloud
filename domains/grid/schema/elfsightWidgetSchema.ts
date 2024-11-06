import { z } from 'zod'

export const elfsightWidgetSchema = iframeWidgetSchema.extend({})

export const elfsightWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.ELFSIGHT)
  )

export type ElfSightWidgetProperties = z.input<typeof elfsightWidgetSchema>