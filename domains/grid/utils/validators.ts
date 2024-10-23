import tinycolor from 'tinycolor2'

/**
 * Validate hex color
 *
 * @param value
 */
export const validateHexColor = async (value: string) => {
  const tColor = tinycolor(value)

  if (!tColor.isValid()) {
    return false
  }

  return true
}

/**
 * Validate url
 *
 * @param value
 */
export const validateUrl = async (value: string) => {
  try {
    new URL(value)
    return true
  } catch (error) {
    return false
  }
}
