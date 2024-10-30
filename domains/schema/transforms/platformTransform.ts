import { z } from 'zod'

const { formatMessage } = useIntl()

/**
 *
 *
 * @param values
 * @param ctx
 * @param type
 */
export const platformTransform = async (
  values: {
    src: string
  },
  ctx: z.RefinementCtx,
  type: GridWidgetType
) => {
  try {
    const properties = await parsePlatformInput(type, values.src)
    return properties
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
