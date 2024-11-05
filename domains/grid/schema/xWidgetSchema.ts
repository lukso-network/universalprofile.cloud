import { z } from 'zod'

export const xType = z.enum(['timeline', 'status', 'video'])

// properties schema that is used by JSON config
export const xWidgetSchema = z.object({
  type: xType,
  username: z.string(),
  id: z.string().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
  doNotTrack: z.boolean().optional(),
})

// input schema used to validate user input
export const xWidgetInputSchema = xWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform(
    async (values, ctx) =>
      await platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.X)
  )

// builder schema used to re-create src/embed from properties
export const xWidgetBuilderSchema = xWidgetSchema
  .extend({
    src: z.string().optional(),
  })
  .transform(
    async values =>
      await platformBuildTransform(values, GRID_WIDGET_TYPE.enum.X)
  )

export type XWidgetProperties = z.input<typeof xWidgetSchema>
