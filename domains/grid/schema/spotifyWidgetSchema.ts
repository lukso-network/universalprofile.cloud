import { z } from 'zod'

export const spotifyWidgetSchema = iframeWidgetSchema.extend({})

export const spotifyInputSchema = iframeWidgetSchema
  .partial()
  .extend({
    input: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values.input, ctx, GRID_WIDGET_TYPE.enum.SPOTIFY)
  )

export type SpotifyWidgetProperties = z.input<typeof spotifyWidgetSchema>
