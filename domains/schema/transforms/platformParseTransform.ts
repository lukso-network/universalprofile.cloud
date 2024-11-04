import { z } from 'zod'

const { formatMessage } = useIntl()

export const platformParseTransform = async (
  input: string,
  ctx: z.RefinementCtx,
  type: GridWidgetType
) => {
  try {
    const properties = await parsePlatformInput(type, input)
    return {
      ...properties,
    }
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
