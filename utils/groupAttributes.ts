/**
 * Group attributes by group name
 *
 * @param attributesData
 * @returns
 */
export const groupAttributes = (
  attributesData?: {
    group?: string | null
    value?: string | null
  }[]
): CollectionAttribute[] => {
  const temp: { [group: string]: string[] } = {}

  for (const { group, value } of attributesData || []) {
    if (group !== null && group !== undefined) {
      if (!temp[group]) {
        temp[group] = [value as string]
      } else {
        temp[group].push(value as string)
      }
    }
  }

  const attributes: CollectionAttribute[] = Object.keys(temp)
    .map(group => ({
      id: slug(group),
      group,
      values: temp[group],
    }))
    .sort((a, b) => a.group.localeCompare(b.group))

  return attributes
}
