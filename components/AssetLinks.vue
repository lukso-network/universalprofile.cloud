<script setup lang="ts">
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

type Props = {
  links: LinkMetadata[]
}

defineProps<Props>()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-2">
      {{ $formatMessage('asset_links_title') }}
    </div>
    <div v-for="(link, index) in links" :key="index" class="mb-4">
      <div
        class="inline-flex rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
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
      <br />
    </div>
  </div>
</template>
