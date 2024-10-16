<script setup lang="ts">
const { closeModal, modal } = useModal()
const { formatMessage } = useIntl()

const handleChangeNetwork = async () => {
  const { getNetworkByChainId } = useAppStore()
  const { disconnect } = useBaseProvider()

  await navigateTo({
    path: homeRoute(),
    query: { network: getNetworkByChainId(modal?.data?.chainId).id },
  })
  disconnect()

  // we reload the page to reinitialize web3 instances
  location.reload()
}
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <img
      src="/images/switch-network.png"
      class="mx-auto mb-6 w-[150px]"
      alt=""
    />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ formatMessage('modal_switch_application_network_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize
        :html-content="
          formatMessage('modal_switch_application_network_description', {
            name: `<strong>${modal?.data?.name}</strong>`,
          })
        "
      ></lukso-sanitize>
    </div>
    <div class="grid grid-cols-[max-content,auto]">
      <lukso-button variant="text" @click="closeModal" class="mt-6">
        {{ formatMessage('modal_switch_application_network_cancel') }}
      </lukso-button>
      <lukso-button
        variant="landing"
        is-full-width
        @click="handleChangeNetwork"
        class="mt-6"
      >
        {{ formatMessage('modal_switch_application_network_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
