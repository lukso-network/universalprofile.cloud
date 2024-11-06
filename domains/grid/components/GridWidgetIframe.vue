<script setup lang="ts">
type Props = {
  src: string
  allow?: string
  referrerpolicy?: IframeReferrerPolicy
  allowfullscreen?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="h-full p-3">
    <iframe
      :src="src"
      :allow="allow"
      :referrerpolicy="referrerpolicy"
      :allowfullscreen="allowfullscreen"
      frameborder="0"
      loading="lazy"
      class="size-full overflow-hidden rounded-8"
    ></iframe>
  </div>
</template>
