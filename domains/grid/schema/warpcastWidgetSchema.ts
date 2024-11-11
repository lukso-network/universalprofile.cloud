import { z } from 'zod'

export const warpcastWidgetSchema = iframeWidgetSchema.extend({})

export const warpcastWidgetInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform(
    async (values, ctx) =>
      await platformParseTransform(
        values.input,
        ctx,
        GRID_WIDGET_TYPE.enum.WARPCAST
      )
  )

export type WarpcastWidgetProperties = z.input<typeof warpcastWidgetSchema>
