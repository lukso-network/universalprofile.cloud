export const capitalize = (_text?: string) => {
  if (!_text || typeof _text !== 'string') {
    return ''
  }

  const text = _text.trim().toLowerCase()

  return text.charAt(0).toUpperCase() + text.slice(1)
}
