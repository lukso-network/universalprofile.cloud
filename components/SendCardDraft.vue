<script setup lang="ts">
const { connectedProfile } = useConnectedProfile()
const { asset, receiver, receiverError, amount, onSend } =
  storeToRefs(useSendStore())
const { isLoadedApp } = storeToRefs(useAppStore())
const { showModal } = useModal()

const handleSend = () => {
  onSend.value && onSend.value()
}

const handleSelectAssets = () => {
  showModal({
    template: 'SelectAssets',
  })
}

const handleBack = () => {
  try {
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo(profileRoute(connectedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card
    variant="profile-2"
    :background-url="connectedProfile?.backgroundImage?.url"
    :profile-url="connectedProfile?.profileImage?.url"
    :profile-address="connectedProfile?.address"
    is-full-width
  >
    <div slot="header" class="text-left">
      <lukso-icon
        name="arrow-left-sm"
        class="relative z-[1] m-4 cursor-pointer rounded-full bg-neutral-100 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
        @click="handleBack"
      ></lukso-icon>
    </div>
    <div slot="content" class="relative p-6 pt-0">
      <div
        class="relative z-[1] grid grid-cols-[max-content,auto] grid-rows-1 transition"
        :class="{
          'invisible opacity-0': !isLoadedApp,
          'visible opacity-100': isLoadedApp,
        }"
      >
        <div
          class="flex items-center justify-center rounded-[12px_0_0_12px] border border-r-0 border-neutral-90 p-4"
        >
          <div class="rounded-full shadow-neutral-above-shadow-1xl">
            <lukso-profile
              size="small"
              :profile-url="getAssetThumb(asset, isToken(asset))"
              :profile-address="asset?.address"
              :has-identicon="isLyx(asset) ? undefined : true"
              :is-square="isNft(asset) ? true : undefined"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex w-full flex-col">
          <div
            class="paragraph-inter-14-semi-bold flex cursor-pointer items-center justify-between rounded-[0_12px_0_0] border border-neutral-90 px-4 py-3 transition hover:border-neutral-35"
            @click="handleSelectAssets"
          >
            {{ asset?.name }}
            <lukso-icon name="arrow-down-lg"></lukso-icon>
          </div>
          <div class="rounded-[0_0_12px_0] border border-t-0 border-neutral-90">
            <SendCardAmount />
          </div>
        </div>
      </div>
      <div
        class="absolute inset-0 m-6 mt-0 grid grid-rows-2 gap-2 transition"
        :class="{
          'opacity-0': isLoadedApp,
          'animate-pulse opacity-100': !isLoadedApp,
        }"
      >
        <div class="rounded-12 bg-neutral-95"></div>
        <div class="rounded-12 bg-neutral-95"></div>
      </div>
    </div>
    <div slot="bottom" class="flex flex-col items-center p-6">
      <AppAvatar
        :is-eoa="receiver?.isEoa"
        :is-error="!!receiverError"
        :name="receiver?.name"
        :address="receiver?.address"
        :profile-url="receiver?.profileImage?.url"
      />
      <SendCardProfileSearch />
      <lukso-button
        class="mt-4 w-full"
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
