import { z } from 'zod'

export const spotifyWidgetSchema = z
  .object({
    src: z.string(),
    type: z.string(),
    allow: z.string(),
    theme: z.string(),
  })
  .transform((values, ctx) =>
    parsePlatform(values, ctx, GRID_WIDGET_TYPE.enum.SPOTIFY)
  )

export type SpotifyWidgetProperties = z.infer<typeof spotifyWidgetSchema>
