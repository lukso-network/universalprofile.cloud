<script setup lang="ts">
import type { AssetType } from '@/models/asset'

type Props = {
  standard?: AssetType
}

defineProps<Props>()
</script>

<template>
  <lukso-tag v-if="standard" size="x-small" background-color="lukso-90">{{
    StandardsAbbreviations[standard]
  }}</lukso-tag>
</template>
