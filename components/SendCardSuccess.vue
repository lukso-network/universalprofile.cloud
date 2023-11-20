<script setup lang="ts">
const { setStatus, clearSend } = useSendStore()
const { transactionHash } = storeToRefs(useSendStore())
const { hasSimpleNavbar } = storeToRefs(useAppStore())
const { connectedProfile } = useConnectedProfile()

const handleSendMore = () => {
  clearSend()
  setStatus('draft')
  hasSimpleNavbar.value = false
}

const handleOpenProfile = () => {
  try {
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo(profileRoute(connectedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card variant="with-header" is-full-width>
    <div slot="header" class="px-6 py-10 flex flex-col">
      <SendCardHeader />
    </div>
    <div slot="content" class="p-8 flex flex-col items-center">
      <div class="heading-inter-17-semi-bold">
        {{ $formatMessage('send_success_title') }}
      </div>
      <lukso-icon
        name="progress-complete"
        size="x-large"
        class="my-6"
      ></lukso-icon>
      <lukso-button variant="secondary" @click="handleSendMore">{{
        $formatMessage('send_success_button')
      }}</lukso-button>
    </div>
  </lukso-card>
  <a
    v-if="transactionHash"
    class="mt-5 paragraph-inter-12-medium underline text-purple-51 hover:text-purple-41 block"
    :href="explorerTransactionUrl(transactionHash)"
    target="_blank"
    >{{ $formatMessage('send_card_view_in_explorer') }}</a
  >
  <lukso-button
    class="mt-8"
    size="small"
    variant="secondary"
    @click="handleOpenProfile"
  >
    <lukso-icon name="return-left" size="small" class="mr-2"></lukso-icon>
    {{ $formatMessage('send_card_return_to_profile') }}
  </lukso-button>
</template>
