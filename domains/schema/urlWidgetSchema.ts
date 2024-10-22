import * as z from 'zod'

const { formatMessage } = useIntl()

export const urlWidgetSchema = z.object({
  src: z
    .string()
    .default('')
    .refine(validateUrl, {
      message: formatMessage('errors_invalid_url'),
    })
    .transform(value => encodeURI(value)),
})

export type UrlWidgetProperties = z.infer<typeof urlWidgetSchema>
