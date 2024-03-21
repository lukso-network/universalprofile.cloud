<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const links = computed(() => props.asset?.resolvedMetadata?.links)
</script>

<template>
  <div v-if="isLoaded">
    <div v-if="links?.length" class="mb-8">
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
            <div class="flex w-full items-center text-left">
              {{ link.title || link.url }}
              <lukso-icon name="link-1" size="small" class="ml-2"></lukso-icon>
            </div>
          </lukso-button>
        </div>
      </div>
    </div>
  </div>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="h-[48px] w-[170px]" />
    <AppPlaceholderLine class="h-[48px] w-[140px]" />
  </AppPlaceholderSection>
</template>
