const removeGridLayoutItem = (id: string) => {
  const { gridLayout, hasUnsavedGrid } = storeToRefs(useAppStore())

  if (!id || typeof id !== 'string') {
    return
  }

  gridLayout.value = gridLayout.value.filter(item => item.id !== id)
  hasUnsavedGrid.value = true
}

export const useGrid = () => {
  return {
    removeGridLayoutItem,
  }
}
