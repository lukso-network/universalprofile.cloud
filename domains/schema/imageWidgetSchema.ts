import * as z from 'zod'

const { formatMessage } = useIntl()

export const imageWidgetSchema = z.object({
  src: z
    .string()
    .default('')
    .refine(validateUrl, {
      message: formatMessage('errors_invalid_url'),
    })
    .transform(value => encodeURI(value)),
})

export type ImageWidgetProperties = z.infer<typeof imageWidgetSchema>
