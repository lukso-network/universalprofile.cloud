import { z } from 'zod'

/**
 * Validate url
 *
 * @param value
 * @param ctx
 */
export const urlTransform = async (value: string, ctx: z.RefinementCtx) => {
  const { formatMessage } = useIntl()

  try {
    new URL(value)
    return encodeURI(value)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatMessage('errors_invalid_url'),
    })
    return z.NEVER
  }
}
