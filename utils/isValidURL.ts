/**
 * Check if a string is a valid URL
 *
 * @param url
 * @returns
 */
export const isValidURL = (url?: string): boolean => {
  if (!url) {
    return false
  }

  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}
