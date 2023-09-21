<script setup lang="ts">
import { fromWei, isAddress } from 'web3-utils'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'

const { profile: connectedProfile } = useConnectedProfileStore()
const { asset, receiver, receiverError, amount, onSend } = storeToRefs(
  useSendStore()
)
const { formatMessage } = useIntl()
const isReceiverLoading = ref<boolean>(false)

const handleReceiverChange = async (event: CustomEvent) => {
  const address = event.detail.value
  receiver.value = { address }

  // check if address is valid
  if (!isAddress(address)) {
    receiverError.value = formatMessage('errors_invalid_address')
    receiver.value = undefined
    return
  } else {
    receiverError.value = ''
  }

  try {
    isReceiverLoading.value = true
    receiver.value = await fetchProfile(address)
  } catch (error) {
    if (error instanceof EoAError) {
      receiver.value.isEoa = true
    } else {
      receiver.value.isEoa = false
    }

    console.error(error)
  } finally {
    isReceiverLoading.value = false
  }
}

const handleKeyDown = (customEvent: CustomEvent) => {
  const numberRegex = /^[0-9]*\.?[0-9]*$/
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  const key = event.key
  const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight']
  const realValueBN = new BigNumber(`${input.value}${key}`)
  const assetBalanceBN = new BigNumber(`${fromWei(asset.value?.amount || '0')}`)
  const maxDecimalPlaces = 6

  // check for allowed keys
  if (allowedKeys.includes(key)) {
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
    input.value = fromWei(asset.value?.amount?.toString() || '0')
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

const handleUnitClick = (event: CustomEvent) => {
  const input = event.detail.input
  const total = fromWei(asset.value?.amount?.toString() || '0')
  input.value = total
  amount.value = total
}

const handleSend = () => {
  onSend.value && onSend.value()
}
</script>

<template>
  <lukso-card
    variant="profile-2"
    :background-url="connectedProfile.backgroundImageUrl"
    :profile-url="connectedProfile.profileImageUrl"
    :profile-address="connectedProfile.address"
    is-full-width
  >
    <div slot="content" class="p-6 pt-0">
      <div
        class="border border-neutral-90 rounded-12 flex justify-center items-center"
      >
        <div class="p-4">
          <div class="shadow-neutral-above-shadow-1xl rounded-full">
            <lukso-profile
              size="small"
              :profile-url="asset?.icon"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div
            class="border-b border-b-neutral-90 border-l border-l-neutral-90 paragraph-inter-14-semi-bold px-4 py-3 flex justify-between items-center"
          >
            {{ asset?.name }}
            <lukso-icon name="arrow-down-lg" class="hidden"></lukso-icon>
          </div>
          <div class="border-l border-l-neutral-90">
            <lukso-input
              placeholder="0"
              :value="amount"
              :unit="
                $formatMessage('profile_balance_of', {
                  balance: $formatNumber(
                    fromWei(asset?.amount || '0', 'ether')
                  ),
                  symbol: asset?.symbol || '',
                })
              "
              borderless
              is-full-width
              @on-key-down="handleKeyDown"
              @on-key-up="handleKeyUp"
              @on-unit-click="handleUnitClick"
            ></lukso-input>
          </div>
        </div>
      </div>
    </div>
    <div slot="bottom" class="p-6 flex flex-col items-center">
      <AppAvatar
        :is-loading="isReceiverLoading"
        :is-eoa="receiver?.isEoa"
        :is-error="!!receiverError"
        :address="receiver?.address"
        :profile="receiver"
      />
      <lukso-input
        name="receiver"
        :value="receiver?.address"
        :placeholder="$formatMessage('send_input_placeholder')"
        is-full-width
        class="w-full mt-4"
        :error="receiverError"
        @on-input="handleReceiverChange"
      ></lukso-input>
      <lukso-button
        class="w-full mt-4"
        :loading="isReceiverLoading"
        :disabled="
          !receiver?.address || receiverError || !Number(amount)
            ? true
            : undefined
        "
        @click="handleSend"
        is-full-width
        >{{
          $formatMessage('send_button', {
            amount: !!Number(amount) ? $formatNumber(amount || '') : '',
            symbol: asset?.symbol || '',
          })
        }}</lukso-button
      >
    </div>
  </lukso-card>
</template>
