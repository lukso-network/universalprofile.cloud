<script setup lang="ts">
type Props = {
  tokenId: string
}

defineProps<Props>()
</script>

<template>
  <div
    class="mb-8 rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <lukso-icon name="smart-contract-doc" size="small"></lukso-icon>
        <div class="paragraph-inter-14-medium ml-2">
          {{ $formatMessage('token_details_token_id') }}
        </div>
      </div>
      <lukso-tooltip
        variant="light"
        offset="15"
        is-clipboard-copy
        :copy-text="$formatMessage('asset_address_copied_tooltip')"
        :copy-value="tokenId"
      >
        <lukso-icon
          name="copy"
          size="small"
          class="cursor-pointer transition-opacity hover:opacity-70"
        ></lukso-icon>
      </lukso-tooltip>
    </div>
    <div class="paragraph-ptmono-12-bold pt-3">{{ tokenId }}</div>
  </div>
</template>
