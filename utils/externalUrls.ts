/**
 * URL to transaction on blockchain explorer
 *
 * @param transactionHash
 * @returns
 */
export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}

/**
 * URL to contract on blockchain explorer
 *
 * @param address
 * @returns
 */
export const explorerContractUrl = (address?: string | Address) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/address/${address}`
}

/**
 * URL to Transak to buy LYX
 *
 * @returns
 */
export const transakBuyLyxUrl = () => {
  const connectedProfile = useProfile().connectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())
  const { formatMessage } = useIntl()
  const { $config } = useNuxtApp()
  const walletAddress = connectedProfile?.value?.address || ''

  const queryParams = {
    apiKey: $config.public.TRANSAK_API_KEY,
    network: 'lukso',
    defaultCryptoCurrency: 'LYX',
    productsAvailed: 'BUY',
    walletAddress,
    isFeeCalculationHidden: 'true',
    defaultPaymentMethod: 'credit_debit_card',
    hideMenu: 'true',
    redirectURL: `${BASE_DAPP_URL}/${walletAddress}?network=${currentNetwork.value.id}`,
    themeColor: '243542', // neutral-20
    exchangeScreenTitle: formatMessage('transak_widget_title'),
  }

  const queryParamsString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${TRANSAK_HOST}/?${queryParamsString}`
}

/**
 * URL to profile dashboard on my.universalprofile.cloud
 *
 * @returns
 */
export const myUpDappDashboardUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_MY_UP_CLOUD_URL}/dashboard?network=${currentNetwork.value.id}`
}

/**
 * URL to landing page on my.universalprofile.cloud
 *
 * @returns
 */
export const myUpDappBaseUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_MY_UP_CLOUD_URL}?network=${currentNetwork.value.id}`
}
