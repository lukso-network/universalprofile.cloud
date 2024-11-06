import { z } from 'zod'

const imagesType = z.enum(['grid', 'carousel'])

export const imagesWidgetSchema = z.object({
  type: imagesType.default(imagesType.enum.grid),
  images: z.array(z.string().transform(urlTransform)),
})

export type ImagesWidgetProperties = z.input<typeof imagesWidgetSchema>
export type ImagesType = z.infer<typeof imagesType>
