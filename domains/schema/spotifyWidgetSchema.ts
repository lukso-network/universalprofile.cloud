import { z } from 'zod'

export const spotifyWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string().optional(),
    allow: z.string().optional(),
    theme: z.string().optional(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values, ctx, GRID_WIDGET_TYPE.enum.SPOTIFY)
  )

export type SpotifyWidgetProperties = z.input<typeof spotifyWidgetSchema>
