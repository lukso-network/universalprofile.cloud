<script setup lang="ts">
type Props = {
  src: string
  allow: string
  embedType: string
  widget: GridWidget
}

const SPOTIFY_LARGE_EMBED_HEIGHT_PX = 352

const props = defineProps<Props>()

const iframeHeight = computed(() => {
  // for one row widget we use Spotify large (352px) embed, otherwise it resizes into small one (152px)
  if (props.widget.h === 1) {
    return SPOTIFY_LARGE_EMBED_HEIGHT_PX
  }

  return '100%'
})
</script>

<template>
  <div class="h-full p-3">
    <div ref="wrapperRef" class="h-[inherit] overflow-scroll rounded-12">
      <iframe
        ref="iframeRef"
        :src="src"
        :allow="allow"
        :height="iframeHeight"
        width="100%"
        loading="lazy"
      ></iframe>
    </div>
  </div>
</template>
