<script setup lang="ts">
type Props = {
  tokens?: Asset[]
  withoutTitle?: boolean
  showLyx?: boolean
}

withDefaults(defineProps<Props>(), {
  tokens: undefined,
  withoutTitle: false,
  showLyx: true,
})

const { isOwned } = useFilters()
</script>

<template>
  <div>
    <h3 v-if="!withoutTitle" class="heading-inter-17-semi-bold pb-4">
      {{ $formatMessage('tokens_title') }}
    </h3>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      <TokenListCardLyx v-if="isOwned && showLyx" />
      <TokenListCardGraph
        v-for="(asset, index) in tokens"
        :key="index"
        :asset="asset"
      />
    </div>
  </div>
</template>
