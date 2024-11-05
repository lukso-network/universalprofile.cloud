import { z } from 'zod'

export const warpcastWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
})

export const warpcastInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string().transform(urlTransform),
  })
  .transform(values => {
    return {
      ...values,
      src: values.input,
      widgetType: GRID_WIDGET_TYPE.enum.WARPCAST,
    }
  })

export type WarpcastWidgetProperties = z.input<typeof warpcastWidgetSchema>
