<script setup lang="ts">
import BigNumber from 'bignumber.js'

const { asset, receiverError, amount } = storeToRefs(useSendStore())

const balance = computed(() => {
  if (
    isLsp8(asset.value) &&
    asset.value?.tokenId &&
    asset.value?.tokenIdsOf?.includes(asset.value.tokenId)
  ) {
    return '1'
  }

  if (isLsp7(asset.value) || isLyx(asset.value)) {
    return asset.value?.balance || '0'
  }

  return '0'
})

/**
 * Key down handled does input field validation
 *
 * @param customEvent
 */
const handleKeyDown = async (customEvent: CustomEvent) => {
  const numberRegex = /^[0-9]*\.?[0-9]*$/
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  const key = event.key
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']
  const realValueBN = new BigNumber(`${input.value}${key}`)

  const assetBalanceBN = new BigNumber(
    `${fromTokenUnitWithDecimals(balance.value, asset.value?.decimals)}`
  )
  const maxDecimalPlaces = asset.value?.decimals || 0

  // check for allowed keys or if user press CMD+A (selection, CMD+V (paste) or CMD+C (copy)
  if (
    allowedKeys.includes(key) ||
    (event.metaKey && key === 'a') ||
    (event.metaKey && key === 'c')
  ) {
    return
  }

  // allow paste only numbers
  if (event.metaKey && key === 'v') {
    const pastedValue = await navigator.clipboard.readText()
    const pastedValueParsed = parseValue(pastedValue)

    if (!numberRegex.test(pastedValueParsed)) {
      await sleep(1)
      input.value = ''
      event.preventDefault()
    }
  }

  // allow type only numbers
  if (!numberRegex.test(key)) {
    event.preventDefault()
  } else {
    // Did it like this otherwise, if a user presses Esc or any non digit key, it would reset the error message
    receiverError.value = ''
  }

  // when value is more then balance we set to max value
  if (realValueBN.gt(assetBalanceBN)) {
    amount.value = fromTokenUnitWithDecimals(
      balance.value,
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

// when user paste value with comma 123,44 we swap to dot notation 123.44
const parseValue = (value: string) => String(value).replace(',', '.')

/**
 * Key up handled updates input field
 *
 * @param event
 */
const handleKeyUp = (event: CustomEvent) => {
  const input = event.detail.event.target
  amount.value = parseValue(input.value)
}

const handleUnitClick = () => {
  const total = fromTokenUnitWithDecimals(balance.value, asset.value?.decimals)
  amount.value = total
}
</script>

<template>
  <lukso-input
    placeholder="0"
    :value="amount"
    :unit="
      $formatMessage('profile_balance_of', {
        balance: $formatNumber(
          fromTokenUnitWithDecimals(balance, asset?.decimals) || '',
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
