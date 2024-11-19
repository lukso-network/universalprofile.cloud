<script setup lang="ts">
import { useScriptTag } from '@vueuse/core'

type Props = {
  url: string
  iframelyUrl: string
}

defineProps<Props>()

useScriptTag('https://cdn.iframe.ly/embed.js', () => {}, {
  async: true,
  defer: true,
})
</script>

<template>
  <div v-if="iframelyUrl" class="relative m-3 overflow-auto">
    <div class="iframely-embed">
      <div class="iframely-responsive">
        <a :href="url" :data-iframely-url="iframelyUrl"></a>
      </div>
    </div>
  </div>
</template>
