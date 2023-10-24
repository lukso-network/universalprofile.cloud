<script setup lang="ts">
const { profile: connectedProfile, status } = useConnectedProfileStore()
const { asset, receiver, receiverError, amount, onSend } = storeToRefs(
  useSendStore()
)
const { showModal } = useModal()

const handleSend = () => {
  onSend.value && onSend.value()
}

const handleSelectAssets = () => {
  showModal({
    template: 'SelectAssets',
  })
}
</script>

<template>
  <lukso-card
    variant="profile-2"
    :background-url="connectedProfile.backgroundImage"
    :profile-url="connectedProfile.profileImage"
    :profile-address="connectedProfile.address"
    is-full-width
  >
    <div slot="content" class="p-6 pt-0 relative">
      <div
        class="grid grid-rows-1 grid-cols-[max-content,auto] transition relative z-[1]"
        :class="{
          'opacity-0 invisible': !status.isProfileLoaded,
          'opacity-100 visible': status.isProfileLoaded,
        }"
      >
        <div
          class="p-4 border border-neutral-90 border-r-0 rounded-[12px_0_0_12px] flex justify-center items-center"
        >
          <div class="shadow-neutral-above-shadow-1xl rounded-full">
            <lukso-profile
              size="small"
              :profile-url="getAssetThumb(asset)"
              :profile-address="asset?.address"
              :has-identicon="isLyx(asset) ? undefined : true"
              :is-square="isNft(asset) ? true : undefined"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div
            class="border border-neutral-90 rounded-[0_12px_0_0] cursor-pointer paragraph-inter-14-semi-bold px-4 py-3 flex justify-between items-center transition hover:border-neutral-35"
            @click="handleSelectAssets"
          >
            {{ asset?.name }}
            <lukso-icon name="arrow-down-lg"></lukso-icon>
          </div>
          <div class="border border-neutral-90 border-t-0 rounded-[0_0_12px_0]">
            <SendCardAmount />
          </div>
        </div>
      </div>
      <div
        class="gap-2 grid grid-rows-2 absolute top-0 left-0 right-0 bottom-0 m-6 mt-0 transition"
        :class="{
          'opacity-0': status.isProfileLoaded,
          'opacity-100 animate-pulse': !status.isProfileLoaded,
        }"
      >
        <div class="bg-neutral-95 rounded-12"></div>
        <div class="bg-neutral-95 rounded-12"></div>
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
