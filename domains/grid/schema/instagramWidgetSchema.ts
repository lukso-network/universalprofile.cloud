import { z } from 'zod'

export const instagramType = z.enum(['p', 'reel'])

// properties schema that is used by JSON config
export const instagramWidgetSchema = z.object({
  type: instagramType,
  id: z.string(),
})

// input schema used to validate user input
export const instagramWidgetInputSchema = instagramWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.INSTAGRAM)
  )

// builder schema used to re-create src/embed from properties
export const instagramWidgetBuilderSchema = instagramWidgetSchema
  .extend({
    src: z.string().optional(),
  })
  .transform(
    async values =>
      await platformBuildTransform(values, GRID_WIDGET_TYPE.enum.INSTAGRAM)
  )

export type InstagramWidgetProperties = z.input<typeof instagramWidgetSchema>
