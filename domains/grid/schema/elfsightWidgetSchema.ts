import { z } from 'zod'

export const elfsightWidgetSchema = z
  .object({
    src: z.string(),
  })
  .transform((values, ctx) =>
    platformParseTransform(values, ctx, GRID_WIDGET_TYPE.enum.ELFSIGHT)
  )

export type ElfSightWidgetProperties = z.input<typeof elfsightWidgetSchema>