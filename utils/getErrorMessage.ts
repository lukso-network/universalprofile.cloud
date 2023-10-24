export const getConnectionErrorMessage = (error: unknown) => {
  const { formatMessage } = useIntl()

  // known error types
  if (error instanceof EoAError) {
    return formatMessage('web3_eoa_error_message')
  }

  if (error instanceof InterfaceError) {
    return formatMessage('web3_interface_error_message')
  }

  // errors that have a code or message
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 4001:
        return formatMessage('web3_connect_error_rejected_request')
      case -32005:
        return formatMessage('web3_connect_error_pending_request')
      default:
        break
    }
  }

  // generic message for unknowns errors
  return formatMessage('web3_connect_error')
}

export const getSendErrorMessage = (error: unknown): string => {
  const { formatMessage } = useIntl()
  const appStore = useAppStore()

  // errors that have a code or message
  if (error && typeof error === 'object' && 'code' in error) {
    switch (error.code) {
      case 4001:
        return formatMessage('send_error_rejected_request')
      case -32602:
        return formatMessage('send_error_same_address', {
          lyxSymbol: appStore.currentNetwork.token.symbol,
        })
      default:
        break
    }
  }

  // generic message for unknowns errors
  return formatMessage('send_error_message')
}
