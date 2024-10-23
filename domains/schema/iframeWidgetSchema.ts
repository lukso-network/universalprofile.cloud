import * as z from 'zod'

const { formatMessage } = useIntl()

export const iframeWidgetSchema = z.object({
  src: z
    .string()
    .default('')
    .refine(validateUrl, {
      message: formatMessage('errors_invalid_url'),
    })
    .transform(value => encodeURI(value)),
  allow: z.string().optional(),
})

export type IframeWidgetProperties = z.infer<typeof iframeWidgetSchema>
