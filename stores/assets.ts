export const useAssetsStore = defineStore('assets', () => {
  const lsp7Assets = ref<Lsp7AssetType[]>()
  const lsp8Assets = ref<Lsp8AssetType[]>()

  const setLsp7Assets = (newAssets: Lsp7AssetType[]) => {
    lsp7Assets.value = newAssets
  }

  const setLsp8Assets = (newAssets: Lsp8AssetType[]) => {
    lsp8Assets.value = newAssets
  }

  return {
    lsp7Assets,
    lsp8Assets,
    setLsp7Assets,
    setLsp8Assets,
  }
})
