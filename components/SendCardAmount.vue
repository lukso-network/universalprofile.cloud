<script setup lang="ts">
import { fromWei } from 'web3-utils'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'

const { asset, receiverError, amount } = storeToRefs(useSendStore())

const handleKeyDown = (customEvent: CustomEvent) => {
  const numberRegex = /^[0-9]*\.?[0-9]*$/
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  const key = event.key
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']
  const realValueBN = new BigNumber(`${input.value}${key}`)
  const assetBalanceBN = new BigNumber(`${fromWei(asset.value?.amount || '0')}`)
  const maxDecimalPlaces = 6

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
    amount.value = fromWei(asset.value?.amount?.toString() || '0')
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
  const total = fromWei(asset.value?.amount?.toString() || '0')
  amount.value = total
}
</script>

<template>
  <lukso-input
    placeholder="0"
    :value="amount"
    :unit="
      $formatMessage('profile_balance_of', {
        balance: $formatNumber(fromWei(asset?.amount || '0', 'ether')),
        symbol: asset?.symbol || '',
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
