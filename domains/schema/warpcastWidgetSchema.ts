import { z } from 'zod'

const { formatMessage } = useIntl()

export const warpcastWidgetSchema = z.object({
  src: z
    .string()
    .refine(validateUrl, {
      message: formatMessage('errors_invalid_url'),
    })
    .transform(value => encodeURI(value)),
  allow: z.string().optional(),
})

export type WarpcastWidgetProperties = z.infer<typeof warpcastWidgetSchema>
