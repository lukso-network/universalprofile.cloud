import { z } from 'zod'

export const xType = z.enum(['timeline', 'status', 'video'])

// properties schema that is used by JSON config
export const xPropertiesSchema = z.object({
  type: xType,
  username: z.string(),
  id: z.string().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
  doNotTrack: z.boolean().optional(),
})

// input schema used to validate user input
export const xInputSchema = xPropertiesSchema
  .partial()
  .extend({
    input: z.string(),
    widgetType: z.literal('X').optional(),
  })
  .transform(
    async (values, ctx) =>
      await platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.X)
  )

// builder schema used to re-create src/embed from properties
export const xBuilderSchema = xPropertiesSchema
  .extend({
    src: z.string().optional(),
  })
  .transform(
    async values =>
      await platformBuildTransform(values, GRID_WIDGET_TYPE.enum.X)
  )

export type XProperties = z.input<typeof xPropertiesSchema>
export type XInput = z.input<typeof xInputSchema>
export type XParser = Omit<XInput, 'input'>
export type XBuilder = z.infer<typeof xBuilderSchema>
export type XType = z.input<typeof xType>
