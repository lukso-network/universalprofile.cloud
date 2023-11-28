<script setup lang="ts">
import { Creator } from '@/models/creator'

type Props = {
  creators: Creator[]
}

defineProps<Props>()
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('asset_links_title') }}
  </div>
  <div
    v-for="(creator, index) in creators"
    :key="index"
    class="mb-8 inline-flex rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    {{ creator?.name }}
  </div>
</template>
