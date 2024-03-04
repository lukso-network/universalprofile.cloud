<script setup lang="ts">
type Props = {
  totalSupply?: string
  decimals?: number
}

defineProps<Props>()
</script>

<template>
  <div class="paragraph-ptmono-14-regular" v-if="totalSupply">
    {{
      $formatMessage('token_details_total_supply_of', {
        count: $formatNumber(fromWeiWithDecimals(totalSupply, decimals)),
      })
    }}
  </div>
</template>
