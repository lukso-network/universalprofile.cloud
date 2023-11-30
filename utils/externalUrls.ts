export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}

export const discoveryDappUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_UP_CLOUD_URL}?network=${currentNetwork.value.id}`
}
