import { z } from 'zod'

const filterValidWidgetSchema = z.array(z.unknown()).transform(
  async widgetItems =>
    await widgetItems.reduce<Promise<unknown[]>>(
      async (accPromise, widgetItem) => {
        const acc = await accPromise
        // validate widget structure without properties
        const widgetValidation = await gridConfigWidgetSchema
          .omit({ properties: true })
          .safeParseAsync(widgetItem)

        if (
          widgetValidation.success &&
          typeof widgetItem === 'object' &&
          widgetItem &&
          'type' in widgetItem &&
          'properties' in widgetItem
        ) {
          // validate widget properties
          const schema = WIDGET_SCHEMA_MAP[widgetItem.type as GridWidgetType]
          const propertyValidation = await schema?.output?.safeParseAsync(
            widgetItem.properties
          )

          if (propertyValidation?.success) {
            acc.push({
              ...widgetItem,
              properties: propertyValidation.data,
            })
          } else {
            console.warn(
              'Invalid properties',
              propertyValidation?.error,
              widgetItem
            )
          }
        } else {
          console.warn('Invalid widget', widgetValidation.error, widgetItem)
        }

        return acc
      },
      Promise.resolve([])
    )
)

const filterValidConfigSchema = z.array(z.unknown()).transform(
  async configItems =>
    await configItems.reduce<Promise<unknown[]>>(
      async (accPromise, configItem) => {
        const acc = await accPromise

        // first we validate the grid config item
        const configValidation = await gridConfigSchema
          .omit({ grid: true })
          .safeParseAsync(configItem)
        const validGridConfig = configValidation.data as GridConfig

        if (configValidation.success) {
          const widgets = (configItem as GridConfig)?.grid || []
          // then we validate the widgets
          const widgetValidation =
            await filterValidWidgetSchema.safeParseAsync(widgets)

          if (widgetValidation.success) {
            validGridConfig.grid = widgetValidation.data as GridConfigWidget[]
          }

          acc.push(validGridConfig)
        }

        return acc
      },
      Promise.resolve([])
    )
)

/**
 * Purify grid config to only include valid items based on the schema
 * - config item fields (title, gridColumns) are recreated from defaults
 * - some widget fields are recreated (width, height)
 * - widgets that miss important fields (type, properties) are removed
 *
 * @param config
 */
export const purifyGridConfig = async (
  config: unknown
): Promise<GridConfig[]> => {
  const validation = await filterValidConfigSchema.safeParseAsync(config)

  if (!validation.success) {
    console.warn('Invalid grid config', validation.error, config)
  }

  return validation.data as GridConfig[]
}
