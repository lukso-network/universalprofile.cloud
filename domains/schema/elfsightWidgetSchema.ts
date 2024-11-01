import { z } from 'zod'

export const elfsightWidgetSchema = z
  .object({
    id: z.string(),
  })
  .transform((values, ctx) =>
    platformTransform({ src: values.id }, ctx, GRID_WIDGET_TYPE.enum.ELFSIGHT)
  )

export type ElfSightWidgetProperties = z.input<typeof elfsightWidgetSchema>
