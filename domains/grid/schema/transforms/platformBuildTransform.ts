import { z } from 'zod'

export const platformBuildTransform = async (
  properties: GridWidgetProperties,
  type: GridWidgetType
) => {
  try {
    const build = await buildPlatformOutput(type, properties)
    return {
      ...properties,
      src: build.src,
    }
  } catch (error: unknown) {
    return z.NEVER
  }
}
