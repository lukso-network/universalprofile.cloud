<script setup lang="ts">
type Props = {
  asset: Asset
}

defineProps<Props>()
</script>

<template>
  <lukso-tag is-rounded class="mb-8">
    <div class="flex items-center">
      <div class="paragraph-ptmono-12-bold mr-2">
        {{ tokenIdPrefix(asset?.tokenIdFormat)
        }}{{ parseTokenId(asset?.tokenId, asset?.tokenIdFormat) }}
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
  </lukso-tag>
</template>
