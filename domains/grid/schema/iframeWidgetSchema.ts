import { z } from 'zod'

const iframeReferrerPolicy = z.enum([
  '',
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url',
])

export const iframeWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
  allowfullscreen: z.boolean().optional(),
  referrerpolicy: iframeReferrerPolicy.optional(),
})

export const iframeWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string().transform(urlTransform),
  })
  .transform(values => ({
    ...values,
    src: values.input,
    widgetType: GRID_WIDGET_TYPE.enum.IFRAME,
  }))

export type IframeWidgetProperties = z.input<typeof iframeWidgetSchema>
export type IframeReferrerPolicy = z.infer<typeof iframeReferrerPolicy>
