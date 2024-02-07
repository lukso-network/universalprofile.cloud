<script setup lang="ts">
type Props = {
  tokenSupply?: string
  decimals?: number
}

defineProps<Props>()
</script>

<template>
  <div class="paragraph-ptmono-14-regular" v-if="tokenSupply">
    {{
      $formatMessage('token_details_total_supply_of', {
        count: $formatNumber(fromWeiWithDecimals(tokenSupply, decimals)),
      })
    }}
  </div>
</template>
