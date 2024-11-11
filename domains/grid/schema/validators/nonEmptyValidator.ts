import { z } from 'zod'

/**
 * Validate non empty value
 *
 * @param value
 * @param ctx
 */
export const nonEmptyValidator = async (
  value: string,
  ctx: z.RefinementCtx
) => {
  const { formatMessage } = useIntl()

  if (value === '') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatMessage('errors_required'),
    })
    return false
  }

  return true
}
