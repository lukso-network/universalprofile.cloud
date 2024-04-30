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
 * URL to Discovery dApp aka. universalprofile.cloud
 *
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
  const connectedProfile = useProfile().connectedProfile()
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
    redirectURL: `${BASE_WALLET_URL}/${walletAddress}?buyLyx=transak`,
    themeColor: '243542', // neutral-20
    exchangeScreenTitle: formatMessage('buy_lyx_widget_title'),
  }

  return `${TRANSAK_HOST}/?${queryParamsString(queryParams)}`
}

export const rampBuyLyxUrl = () => {
  const connectedProfile = useProfile().connectedProfile()
  const { formatMessage } = useIntl()
  const { $config } = useNuxtApp()
  const userAddress = connectedProfile?.value?.address || ''

  const queryParams = {
    hostApiKey: $config.public.RAMP_API_KEY,
    hostAppName: formatMessage('buy_lyx_widget_title'),
    hostLogoUrl: `${window.location.origin}/images/lukso.svg`,
    userAddress,
    defaultAsset: 'LUKSO_LYX',
    defaultFlow: 'ONRAMP',
    finalUrl: `${BASE_WALLET_URL}/${userAddress}?buyLyx=ramp`,
    paymentMethodType: 'CARD',
  }

  return `${RAMP_HOST}/?${queryParamsString(queryParams)}`
}

/**
 * URL to Relayer dashboard on my.universalprofile.cloud
 *
 * @returns
 */
export const relayerDappDashboardUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_RELAYER_DAPP_URL}/dashboard?network=${currentNetwork.value.id}`
}
