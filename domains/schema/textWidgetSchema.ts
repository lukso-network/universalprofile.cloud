import { z } from 'zod'

export const textWidgetSchema = z.object({
  titleColor: z.string().default('#243542').superRefine(hexColorValidator),
  textColor: z.string().default('#243542').superRefine(hexColorValidator),
  backgroundColor: z.string().default('#f9f9f9').superRefine(hexColorValidator),
  title: z.string().optional(),
  text: z.string().optional(),
})

export type TextWidgetProperties = z.infer<typeof textWidgetSchema>
