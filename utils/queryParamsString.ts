/**
 * Converts an object of query parameters into a query string.
 *
 * @param params - The object containing the query parameters.
 * @returns The query string representation of the parameters.
 */
export const queryParamsString = (params: Record<string, string>) =>
  Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
