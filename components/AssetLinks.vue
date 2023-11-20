<script setup lang="ts">
import { LinkMetadata } from '@lukso/lsp-smart-contracts'

type Props = {
  links: LinkMetadata[]
}

defineProps<Props>()
</script>

<template>
  <div
    v-for="(link, index) in links"
    :key="index"
    class="mb-8 rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
  >
    <div class="flex items-center">
      <lukso-icon name="link" size="small"></lukso-icon>
      <a
        target="_blank"
        :href="link.url"
        class="paragraph-inter-14-medium ml-2 hover:underline"
        >{{ link.title }}</a
      >
    </div>
  </div>
</template>
