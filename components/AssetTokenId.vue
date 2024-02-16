<script setup lang="ts">
const { isMobile } = useDevice()

type Props = {
  asset: Asset
}

defineProps<Props>()

const tokenLength = computed(() => {
  let tokenLength = 64

  if (isMobile) {
    tokenLength = 36
  }

  return tokenLength
})
</script>

<template>
  <lukso-tag is-rounded class="mb-8">
    <div class="flex items-center">
      <div class="paragraph-ptmono-12-bold mr-2">
        {{ prefixedTokenId(asset?.tokenId, asset?.tokenIdFormat, tokenLength) }}
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
