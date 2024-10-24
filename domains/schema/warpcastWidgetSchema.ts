import { z } from 'zod'

export const warpcastWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
})

export type WarpcastWidgetProperties = z.input<typeof warpcastWidgetSchema>
