<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
</script>

<template>
  <div v-if="isLoaded">
    <AppLinks :links="asset?.resolvedMetadata?.links">
      <template #default="{ socialMediaLinks, otherLinks, hasLinks }">
        <div v-if="hasLinks" class="mb-8">
          <div class="heading-inter-14-bold pb-2">
            {{ $formatMessage('asset_links_title') }}
          </div>
          <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <div
              v-for="(link, index) in socialMediaLinks"
              :key="index"
              class="inline-flex"
            >
              <LinkButton :link="link" size="medium" />
            </div>
            <div
              v-for="(link, index) in otherLinks"
              :key="index"
              class="inline-flex"
            >
              <LinkButton :link="link" size="medium" />
            </div>
          </div>
        </div>
      </template>
    </AppLinks>
  </div>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine class="h-[48px] w-[170px]" />
    <AppPlaceholderLine class="h-[48px] w-[140px]" />
  </AppPlaceholderSection>
</template>
