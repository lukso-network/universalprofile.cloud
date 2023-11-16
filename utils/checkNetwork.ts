export const checkNetwork = async () => {
  const { currentNetwork } = useAppStore()
  const { showModal } = useModal()
  const chainId = (await INJECTED_PROVIDER?.request({
    method: 'eth_chainId',
  })) as string

  if (currentNetwork.chainId !== chainId) {
    showModal({
      template: 'SwitchNetwork',
    })

    throw new Error('Wrong network')
  }
}
