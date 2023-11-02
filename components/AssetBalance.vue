<script setup lang="ts">
type Props = {
  balance?: string
  symbol?: string
  decimals?: number
}

defineProps<Props>()
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('asset_balance_title') }}
  </div>
  <div
    class="bg-neutral-100 border border-neutral-90 py-3 px-4 rounded-12 mb-8"
  >
    <div class="flex items-center justify-between paragraph-inter-14-regular">
      {{ $formatNumber(fromWeiWithDecimals(balance || '', decimals)) }}
      <div
        class="paragraph-inter-12-regular text-neutral-60 border-l border-l-neutral-90 pl-3 ml-3"
      >
        {{ symbol }}
      </div>
    </div>
  </div>
</template>
