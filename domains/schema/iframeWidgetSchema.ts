import { z } from 'zod'

export const iframeWidgetSchema = z.object({
  src: z.string().transform(urlTransform),
  allow: z.string().optional(),
})

export type IframeWidgetProperties = z.infer<typeof iframeWidgetSchema>
