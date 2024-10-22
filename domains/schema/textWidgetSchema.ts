import * as z from 'zod'

const { formatMessage } = useIntl()

export const textWidgetSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  titleColor: z
    .string()
    .default('#243542')
    .refine(validateHexColor, {
      message: formatMessage('errors_invalid_hex_color'),
    }),
  textColor: z
    .string()
    .default('#243542')
    .refine(validateHexColor, {
      message: formatMessage('errors_invalid_hex_color'),
    }),
  backgroundColor: z
    .string()
    .default('#f9f9f9')
    .refine(validateHexColor, {
      message: formatMessage('errors_invalid_hex_color'),
    }),
})

export type TextWidgetProperties = z.infer<typeof textWidgetSchema>
