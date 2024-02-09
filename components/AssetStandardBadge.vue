<script setup lang="ts">
import { STANDARDS_ABBREVIATIONS } from '@/shared/enums'

type Props = {
  standard?: AssetType
}

defineProps<Props>()
</script>

<template>
  <lukso-tag v-if="standard" size="x-small" background-color="lukso-90">{{
    STANDARDS_ABBREVIATIONS[standard]
  }}</lukso-tag>
</template>
