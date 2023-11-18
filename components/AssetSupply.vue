<script setup lang="ts">
type Props = {
  tokenSupply: string
  symbol?: string
  decimals?: number
}

defineProps<Props>()
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('asset_supply_title') }}
  </div>
  <div
    class="mb-8 rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    <div class="paragraph-inter-14-regular flex items-center justify-between">
      {{ $formatNumber(fromWeiWithDecimals(tokenSupply, decimals)) }}
      <div
        class="paragraph-inter-12-regular ml-3 border-l border-l-neutral-90 pl-3 text-neutral-60"
      >
        {{ symbol }}
      </div>
    </div>
  </div>
</template>
