<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  src: string
}

defineProps<Props>()

useScriptTag('https://platform.twitter.com/widgets.js')
</script>

<template>
  <div class="overflow-scroll rounded-[10px]">
    <a class="twitter-timeline" :href="src">Loading</a>
  </div>
</template>
