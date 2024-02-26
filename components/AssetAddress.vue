<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'
import { sliceAddress } from '@lukso/web-components/tools'

type Props = {
  address: Address
}

const props = defineProps<Props>()
const { isMobile } = useDevice()

const truncateAddress = computed(() => {
  let addressLength = 66

  if (isMobile) {
    addressLength = 8
  }
  return sliceAddress(props.address, addressLength)
})
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('token_details_contract_address') }}
  </div>
  <div
    class="mb-8 rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img
          :src="makeBlockie(address)"
          alt=""
          class="bottom-0 right-0 size-6 rounded-full shadow-neutral-above-shadow-1xl outline outline-2 outline-neutral-100"
        />
        <div class="paragraph-ptmono-12-bold ml-2">{{ truncateAddress }}</div>
      </div>
      <div class="flex items-center gap-2">
        <lukso-tooltip
          variant="light"
          offset="15"
          is-clipboard-copy
          :copy-text="$formatMessage('asset_address_copied_tooltip')"
          :copy-value="address"
        >
          <lukso-icon
            name="copy"
            size="small"
            class="cursor-pointer transition-opacity hover:opacity-70"
          ></lukso-icon>
        </lukso-tooltip>
        <a :href="explorerContractUrl(address)" target="_blank" class="flex">
          <lukso-icon
            name="link-1"
            size="small"
            class="cursor-pointer transition-opacity hover:opacity-70"
          ></lukso-icon
        ></a>
      </div>
    </div>
  </div>
</template>
