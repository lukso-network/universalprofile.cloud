import tinycolor from 'tinycolor2'

/**
 * Validate hex color
 *
 * @param value
 */
export const validateHexColor = (value: string) => {
  const tColor = tinycolor(value)

  if (!tColor.isValid()) {
    return false
  }

  return true
}
