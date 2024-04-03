/**
 * Remove schema from URL
 * example: https://example.com will became example.com
 *
 * @param url - http address
 * @returns - address without schema
 */
export const removeSchemaFromUrl = (url?: string): string => {
  if (!url) {
    return ''
  }

  return url.replace(/(^\w+:|^)\/\//, '')
}
