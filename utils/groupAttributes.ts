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
    attributeType?: string | null
  }[]
): CollectionAttribute[] => {
  const groups: { [group: string]: string[] } = {}
  const groupTypes: { [group: string]: string } = {}

  for (const { group, value, attributeType } of attributesData || []) {
    if (group !== null && group !== undefined) {
      if (!groups[group]) {
        groups[group] = [value as string]
        groupTypes[group] = attributeType as string
      } else {
        groups[group].push(value as string)
      }
    }
  }

  const attributes: CollectionAttribute[] = Object.keys(groups)
    .map(group => {
      let values = groups[group]

      // TODO this is temporary way to sort numbers, that doesn't take into consideration added units
      if (groupTypes[group] === 'number') {
        values = values
          .map(value => Number.parseFloat(value))
          .sort((a, b) => a - b)
          .map(value => value.toString())
      } else {
        values = values.sort()
      }

      return {
        id: slug(group),
        group,
        values,
      }
    })
    // sort groups by name
    .sort((a, b) => a.group.localeCompare(b.group))

  return attributes
}
