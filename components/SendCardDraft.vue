<script setup lang="ts">
import { storeToRefs } from 'pinia'

const { profile: connectedProfile } = useConnectedProfileStore()
const { asset, receiver, receiverError, amount, onSend } = storeToRefs(
  useSendStore()
)

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
            <SendCardAmount />
          </div>
        </div>
      </div>
    </div>
    <div slot="bottom" class="p-6 flex flex-col items-center">
      <AppAvatar
        :is-eoa="receiver?.isEoa"
        :is-error="!!receiverError"
        :address="receiver?.address"
        :profile="receiver"
      />
      <SendCardProfileSearch />
      <lukso-button
        class="w-full mt-4"
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
