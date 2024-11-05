export const instagramBuilder = (properties: InstagramWidgetProperties) => {
  let src = ''
  const { id, type } = properties

  if (id && type) {
    src = `https://www.instagram.com/${type}/${id}`
  }
  return {
    src,
  }
}
