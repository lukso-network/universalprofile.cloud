<script setup lang="ts">
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

type Props = {
  links: LinkMetadata[]
}

defineProps<Props>()
const { isMobile } = useDevice()
</script>

<template>
  <div class="mb-8">
    <div class="heading-inter-14-bold pb-2">
      {{ $formatMessage('asset_links_title') }}
    </div>
    <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
      <div v-for="(link, index) in links" :key="index" class="inline-flex">
        <lukso-button
          variant="secondary"
          is-link
          :href="link.url"
          :is-full-width="isMobile ? true : undefined"
          custom-class="paragraph-inter-14-medium"
        >
          {{ link.title }}
          <lukso-icon name="link-1" size="small" class="ml-2"></lukso-icon>
        </lukso-button>
      </div>
    </div>
  </div>
</template>
