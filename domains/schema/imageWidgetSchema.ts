import * as z from 'zod'

export const imageWidgetSchema = z.object({
  src: z.string().url(),
})

export type ImageWidgetProperties = z.infer<typeof imageWidgetSchema>
