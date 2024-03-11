<script setup lang="ts">
import BigNumber from 'bignumber.js'

const { asset, receiverError, amount } = storeToRefs(useSendStore())

const handleKeyDown = (customEvent: CustomEvent) => {
  const numberRegex = /^[0-9]*\.?[0-9]*$/
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  const key = event.key
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']
  const realValueBN = new BigNumber(`${input.value}${key}`)
  const assetBalanceBN = new BigNumber(
    `${fromWeiWithDecimals(asset.value?.balance || '0', asset.value?.decimals)}`
  )
  const maxDecimalPlaces = asset.value?.decimals || 0

  // check for allowed keys or if user press CMD+A
  if (allowedKeys.includes(key) || (event.metaKey && key === 'a')) {
    return
  }

  // allow only numbers
  if (!numberRegex.test(key)) {
    event.preventDefault()
  } else {
    // Did it like this otherwise, if a user presses Esc or any non digit key, it would reset the error message
    receiverError.value = ''
  }

  // when value is more then balance we set to max value
  if (realValueBN.gt(assetBalanceBN)) {
    amount.value = fromWeiWithDecimals(
      asset.value?.balance?.toString() || '0',
      asset.value?.decimals
    )
    event.preventDefault()
  }

  // when asset use 0 decimals we should only allow integers
  if (
    asset.value?.decimals === 0 &&
    (key === '.' || (key === '0' && input.value === ''))
  ) {
    event.preventDefault()
  }

  // allow only one dot in the value, but not as first character
  if (key === '.' && (input.value.includes('.') || input.value === '')) {
    event.preventDefault()
  }

  // check for max decimal places
  if (input.value.toString().split('.')[1]?.length >= maxDecimalPlaces) {
    event.preventDefault()
  }
}

const handleKeyUp = (event: CustomEvent) => {
  const input = event.detail.event.target
  amount.value = input.value
}

const handleUnitClick = () => {
  const total = fromWeiWithDecimals(
    asset.value?.balance?.toString() || '0',
    asset.value?.decimals
  )
  amount.value = total
}
</script>

<template>
  {{ console.log(toRaw(asset)) }}
  <lukso-input
    placeholder="0"
    :value="amount"
    :unit="
      $formatMessage('profile_balance_of', {
        balance: $formatNumber(
          fromWeiWithDecimals(asset?.balance || '0', asset?.decimals) || '',
          {
            maximumFractionDigits: asset?.decimals,
          }
        ),
        symbol: asset?.tokenSymbol || '',
      })
    "
    borderless
    is-full-width
    autofocus
    @on-key-down="handleKeyDown"
    @on-key-up="handleKeyUp"
    @on-unit-click="handleUnitClick"
  ></lukso-input>
</template>
