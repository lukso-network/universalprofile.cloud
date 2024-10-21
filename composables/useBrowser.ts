export const useBrowser = () => {
  const extensionStore = computed(() => {
    const url = browserInfo().storeLink
    const icon = `logo-${browserInfo().id}`

    return {
      icon,
      url,
    }
  })

  return {
    browserSupportExtension: computed(() => extensionStore.value.url !== ''),
    extensionStore,
  }
}
