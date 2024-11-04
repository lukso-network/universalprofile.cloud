export const xBuilder = (
  properties: XProperties
): {
  src: string
} => {
  let src = ''
  const { id, username, type } = properties

  if (type === 'timeline') {
    src = `https://twitter.com/${username}`
  } else if (id) {
    src = `https://twitter.com/${username}/status/${id}`
  }

  return {
    src,
  }
}
