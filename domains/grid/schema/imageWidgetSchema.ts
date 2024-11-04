import { z } from 'zod'

export const imageWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
})

export type ImageWidgetProperties = z.input<typeof imageWidgetSchema>
