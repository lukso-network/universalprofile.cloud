export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}
