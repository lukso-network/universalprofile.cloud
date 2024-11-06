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

const iframeSandbox = z.enum([
  'allow-forms',
  'allow-modals',
  'allow-orientation-lock',
  'allow-pointer-lock',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-presentation',
  'allow-same-origin',
  'allow-scripts',
  'allow-top-navigation',
  'allow-top-navigation-by-user-activation',
])

export const iframeWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
  sandbox: iframeSandbox.optional(),
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
export type IframeSandbox = z.infer<typeof iframeSandbox>
