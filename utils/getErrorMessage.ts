export const getErrorMessage = async (error: unknown) => {
  const { formatMessage } = useIntl()
  const { currentNetwork } = useAppStore()
  const chainId = (await INJECTED_PROVIDER?.request({
    method: 'eth_chainId',
  })) as string

  if (currentNetwork.chainId !== chainId) {
    return formatMessage('error_wrong_network', {
      name: currentNetwork.name,
    })
  }

  // known error types
  if (error instanceof EoAError) {
    return formatMessage('error_eoa')
  }

  if (error instanceof InterfaceError) {
    return formatMessage('error_invalid_profile_interface')
  }

  // errors that have a code or message
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 4001:
        return formatMessage('error_rejected_request')
      case -32005:
        return formatMessage('error_pending_request')
      case -32001:
        return formatMessage('error_no_profiles')
      case -32600:
        return formatMessage('error_no_accounts')
      case -32601:
      case -32602:
        return formatMessage('error_same_address', {
          lyxSymbol: currentNetwork.token.symbol,
        })
      default:
        break
    }
  }

  // generic message for unknowns errors
  return formatMessage('web3_connect_error')
}
