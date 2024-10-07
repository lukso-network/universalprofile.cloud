import assert from 'assert'
import { isAddress } from 'web3-utils'

import { MOBILE_APP_DEEP_LINK_PREFIX } from '@/shared/config'

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
    redirectURL: `${BASE_DAPP_URL}/${walletAddress}?buyLyx=transak`,
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
    finalUrl: `${BASE_DAPP_URL}/${userAddress}?buyLyx=ramp`,
    paymentMethodType: 'CARD',
  }

  return `${RAMP_HOST}/?${queryParamsString(queryParams)}`
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

/**
 * URL to profile page on universal.page
 *
 * @returns
 */
export const universalPageProfileUrl = (address?: Address) => {
  assert(address, 'Address is required')
  assert(isAddress(address), 'Address is not a valid address')
  return `https://universal.page/profiles/lukso/${address}`
}

/**
 * URL to token page on universal.page
 *
 * @param address
 * @param tokenId
 * @returns
 */
export const universalPageAssetUrl = (address?: Address, tokenId?: string) => {
  assert(address, 'Address is required')
  assert(isAddress(address), 'Address is not a valid address')

  if (tokenId) {
    return `https://universal.page/collections/lukso/${address}/${tokenId}`
  }

  return `https://universal.page/assets/lukso/${address}`
}

/**
 * URL to profile page on universalswaps.io
 *
 * @returns
 */
export const universalSwapsProfileUrl = (address?: Address) => {
  assert(address, 'Address is required')
  assert(isAddress(address), 'Address is not a valid address')
  return `https://universalswaps.io/social/${address}`
}

/**
 * URL to token page on universalswaps.io
 *
 * @param address
 * @returns
 */
export const universalSwapsAssetUrl = (address?: Address) => {
  assert(address, 'Address is required')
  assert(isAddress(address), 'Address is not a valid address')
  return `https://universalswaps.io/tokens/lukso/${address.toLowerCase()}`
}

/**
 * URL to Mobile App deep link used by Wallet Connect
 *
 * @param data
 * @returns
 */
export const walletConnectDeepLinkUrl = (data: string) => {
  const urlData = new URL(data)

  return `${MOBILE_APP_DEEP_LINK_PREFIX}://wallet-connect/${urlData.username}${urlData.search}`
}
