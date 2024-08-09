/**
 * Make slug from text
 *
 * @param value
 * @returns
 */
export const slug = (value?: string) => {
  if (!value) {
    return ''
  }

  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}
