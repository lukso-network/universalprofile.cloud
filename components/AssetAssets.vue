<script setup lang="ts">
type Props = {
  assets: AssetMetadata[]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-3">
      {{ $formatMessage('token_details_assets') }}
    </div>
    <div class="flex flex-wrap gap-4">
      <div
        v-for="(asset, index) in assets"
        :key="index"
        class="h-14 w-14 rounded-8 bg-neutral-90 bg-cover"
      >
        {{ asset }}
      </div>
    </div>
  </div>
</template>
