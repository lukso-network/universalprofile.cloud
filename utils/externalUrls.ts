export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}

export const discoveryDappUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_UP_CLOUD_URL}?network=${currentNetwork.value.id}`
}

export const transakBuyLyxUrl = () => {
  const { currentCurrencySymbol } = storeToRefs(useCurrencyStore())
  const { connectedProfile } = useConnectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())

  const queryParams = {
    apiKey: TRANSAK_API_KEY,
    network: 'lukso',
    defaultCryptoCurrency: 'LYX',
    productsAvailed: 'BUY',
    fiatCurrency: currentCurrencySymbol.value,
    walletAddress: connectedProfile.value?.address,
    redirectURL: `${BASE_WALLET_URL}/${connectedProfile.value?.address}?network=${currentNetwork.value.id}`,
  }

  const queryParamsString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${TRANSAK_HOST}/?${queryParamsString}`
}
