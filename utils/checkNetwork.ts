export const checkNetwork = async () => {
  const { currentNetwork } = useAppStore()
  const { showModal } = useModal()
  const chainId = (await INJECTED_PROVIDER?.request({
    method: 'eth_chainId',
  })) as string

  // when we can't get network information from ext it's very likely it's not installed yet, then we just exit
  if (!chainId) {
    return
  }

  // if network mismatch then show modal and break further execution by throwing an error
  if (currentNetwork.chainId !== chainId) {
    showModal({
      template: 'SwitchNetwork',
    })

    throw new Error('Wrong network')
  }
}
