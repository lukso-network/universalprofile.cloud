import { z } from 'zod'

export const xType = z.enum(['timeline', 'status', 'video'])

// output schema defines properties that are expected by the standard
export const xOutputSchema = z.object({
  type: xType,
  username: z.string(),
  id: z.string().optional(),
  theme: z.string().optional(),
  language: z.string().optional(),
  doNotTrack: z.boolean().optional(),
})

// input schema defines properties that comes from user input and should be "validated" in the form
export const xInputSchema = xOutputSchema
  .partial()
  .extend({
    src: z.string(),
    widgetType: z.literal('X').optional(),
  })
  .transform(async (values, ctx) => {
    let src = values.src

    // we construct src based on the input values
    if (!src && values.username) {
      if (values.type === 'timeline') {
        src = `https://twitter.com/${values.username}`
      } else if (values.id) {
        src = `https://twitter.com/${values.username}/status/${values.id}`
      }
    }

    return {
      ...(await platformTransform(
        { ...values, src },
        ctx,
        GRID_WIDGET_TYPE.enum.X
      )),
      widgetType: GRID_WIDGET_TYPE.enum.X,
    }
  })

export type XInputProperties = z.input<typeof xInputSchema>
export type XOutputProperties = z.input<typeof xOutputSchema>
export type XType = z.input<typeof xType>
