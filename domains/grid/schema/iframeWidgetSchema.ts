import { z } from 'zod'

export const iframeWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
})

export const iframeInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string().transform(urlTransform),
  })
  .transform(values => {
    return {
      ...values,
      src: values.input,
      widgetType: GRID_WIDGET_TYPE.enum.IFRAME,
    }
  })

export type IframeWidgetProperties = z.input<typeof iframeWidgetSchema>
