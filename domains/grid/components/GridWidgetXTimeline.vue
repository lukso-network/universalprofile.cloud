<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  src: string
}

defineProps<Props>()

useScriptTag('https://platform.twitter.com/widgets.js')
</script>

<template>
  <div class="m-3 overflow-scroll rounded-12">
    <a class="twitter-timeline" :href="src">Loading</a>
  </div>
</template>
