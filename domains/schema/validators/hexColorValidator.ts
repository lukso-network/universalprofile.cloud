import tinycolor from 'tinycolor2'
import { z } from 'zod'

/**
 * Validate hex color
 *
 * @param value
 */
export const hexColorValidator = async (
  value: string,
  ctx: z.RefinementCtx
) => {
  const { formatMessage } = useIntl()
  const tColor = tinycolor(value)

  if (!tColor.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: formatMessage('errors_invalid_hex_color'),
    })
    return false
  }

  return true
}
