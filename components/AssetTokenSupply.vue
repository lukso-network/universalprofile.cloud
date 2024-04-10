<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const totalSupply = computed(() => props.asset?.totalSupply)
const decimals = computed(() => props.asset?.decimals)
</script>

<template>
  <div v-if="isLoaded">
    <div class="paragraph-ptmono-14-regular pb-8" v-if="totalSupply">
      {{
        $formatMessage('token_details_total_supply_of', {
          count: $formatNumber(
            fromTokenUnitWithDecimals(totalSupply, decimals)
          ),
        })
      }}
    </div>
  </div>
  <AppPlaceholderLine v-else class="mb-8 h-[20px] w-1/3" />
</template>
