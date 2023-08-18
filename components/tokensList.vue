<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AssetFilter, Token } from '@/types/assets'

const { profile } = useProfileStore()
const { tokens, assetFilter } = storeToRefs(useProfileStore())
const lyxAsset = computed<Token>(() => {
  return {
    address: '0x0',
    data: {
      name: 'LUKSO',
      symbol: 'LYX',
      amount: profile.balance,
      address: '0x0',
      icon: '/images/lyx-token.jpg',
    },
  }
})
</script>

<template>
  <div class="pt-8">
    <h3 class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('tokens_title') }}
    </h3>
    <div class="grid gap-6 grid-col grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      <TokenCard v-if="assetFilter === AssetFilter.owned" :asset="lyxAsset" />
      <TokenCard
        v-for="(asset, index) in tokens(assetFilter)"
        :key="index"
        :asset="asset"
        :has-address="true"
      />
    </div>
  </div>
</template>
