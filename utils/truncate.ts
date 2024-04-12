export const truncate = (value: string, length: number) => {
  if (length <= 0 || !value) {
    return ''
  }

  return value.length > length ? `${value.slice(0, length - 1)}...` : value
}
