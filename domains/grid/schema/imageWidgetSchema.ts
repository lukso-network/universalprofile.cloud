import { z } from 'zod'

export const imageWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
})

export const imageWidgetInputSchema = imageWidgetSchema
  .partial()
  .extend({
    input: z.string().transform(urlTransform),
  })
  .transform(values => ({
    ...values,
    src: values.input,
    widgetType: GRID_WIDGET_TYPE.enum.IMAGE,
  }))

export type ImageWidgetProperties = z.input<typeof imageWidgetSchema>
