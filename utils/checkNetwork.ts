/**
 * Check if app network match with provider.
 * If not break execution with error and show modal to switch network.
 *
 * @param triggerNetworkSwitch
 * @returns
 */
export const checkNetwork = async (
  triggerNetworkSwitch?: boolean
): Promise<undefined | never> => {
  const { currentNetwork } = useAppStore()
  const { showModal } = useModal()
  const { currentProvider } = useBaseProvider()

  try {
    const chainId = (await currentProvider.value?.request({
      method: 'eth_chainId',
    })) as string | number

    // when we can't get network information from ext it's very likely it's not installed yet, then we just exit
    if (!chainId) {
      return
    }

    // if network mismatch then show modal and break further execution by throwing an error
    if (currentNetwork.chainId !== numberToHex(chainId)) {
      showModal({
        template: 'SwitchExtensionNetwork',
      })

      throw new Error('Wrong network')
    }
  } catch (error: unknown) {
    console.warn(error)

    if (triggerNetworkSwitch) {
      await currentProvider.value?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: currentNetwork.chainId }],
      })
    }
  }
}
