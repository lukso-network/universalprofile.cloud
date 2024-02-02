<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  asset: Asset
}

defineProps<Props>()
</script>

<template>
  <div
    class="mb-8 inline-flex flex-col rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    <div class="flex items-center justify-between">
      <div class="mr-2 flex items-center">
        <img
          v-if="asset?.tokenId"
          :src="makeBlockie(asset.tokenId)"
          alt=""
          class="bottom-0 right-0 h-4 w-4 rounded-full shadow-neutral-above-shadow-1xl outline outline-2 outline-neutral-100"
        />
        <div class="paragraph-inter-14-medium ml-2">
          {{ $formatMessage('token_details_token_id') }}
        </div>
      </div>
      <lukso-tooltip
        variant="light"
        offset="15"
        is-clipboard-copy
        :copy-text="$formatMessage('asset_address_copied_tooltip')"
        :copy-value="asset?.tokenId"
      >
        <lukso-icon
          name="copy"
          size="small"
          class="cursor-pointer transition-opacity hover:opacity-70"
        ></lukso-icon>
      </lukso-tooltip>
    </div>
    <div class="paragraph-ptmono-12-bold pt-3">
      {{ tokenIdPrefix(asset?.tokenIdFormat)
      }}{{ parseTokenId(asset?.tokenId, asset?.tokenIdFormat) }}
    </div>
  </div>
</template>
