/**
 * URL to blockchain explorer
 *
 * @param transactionHash - The transaction hash
 * @returns
 */
export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}

/**
 * URL to Discovery dApp aka. universalprofile.cloud
 * @returns
 */
export const discoveryDappUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_UP_CLOUD_URL}?network=${currentNetwork.value.id}`
}

/**
 * URL to Transak to buy LYX
 *
 * @returns
 */
export const transakBuyLyxUrl = () => {
  const { currentCurrencySymbol } = storeToRefs(useCurrencyStore())
  const { connectedProfile } = useConnectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())
  const { formatMessage } = useIntl()
  const { $config } = useNuxtApp()

  const queryParams = {
    apiKey: $config.public.TRANSAK_API_KEY,
    network: 'lukso',
    defaultCryptoCurrency: 'LYX',
    productsAvailed: 'BUY',
    fiatCurrency: currentCurrencySymbol.value,
    walletAddress: connectedProfile.value?.address,
    redirectURL: `${BASE_WALLET_URL}/${connectedProfile.value?.address}?network=${currentNetwork.value.id}`,
    themeColor: '243542', // neutral-20
    exchangeScreenTitle: formatMessage('transak_widget_title'),
  }

  const queryParamsString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${TRANSAK_HOST}/?${queryParamsString}`
}
