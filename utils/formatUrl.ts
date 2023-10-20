/**
 * Replaces protocol in the given URL with their respective gateway URLs.
 * If the URL does not contain either protocol, returns the original URL.
 *
 * @param {string} url - The URL to format.
 * @returns {string} The formatted URL.
 */
export function formatUrl(url: string): string {
  if (!url) {
    return ''
  }

  const encodedUrl = encodeURI(url.replace(/(^\w+:|^)\/\//, ''))
  const formattedUrl = `${IPFS_URL}${encodedUrl}`

  return formattedUrl
}
