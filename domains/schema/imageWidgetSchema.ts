import * as z from 'zod'

export const imageWidgetSchema = urlWidgetSchema.extend({})

export type ImageWidgetProperties = z.infer<typeof imageWidgetSchema>
