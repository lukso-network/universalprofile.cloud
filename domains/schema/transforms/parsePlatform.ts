import { z } from 'zod'

const { formatMessage } = useIntl()

/**
 *
 *
 * @param values
 * @param ctx
 * @param type
 */
export const parsePlatform = async (
  values: {
    src: string
  },
  ctx: z.RefinementCtx,
  type: GridWidgetType
) => {
  try {
    const parsedValues = await parsePlatformInput(type, values.src)
    return parsedValues.properties
  } catch (error: unknown) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatMessage('errors_invalid_input', {
        name: capitalize(type),
      }),
      path: ['src'],
    })

    return z.NEVER
  }
}
