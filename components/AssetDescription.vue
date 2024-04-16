<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
const description = computed(() => props.asset?.resolvedMetadata?.description)
</script>

<template>
  <div v-if="isLoaded">
    <div v-if="description" class="mb-8">
      <div class="heading-inter-14-bold pb-3">
        {{ $formatMessage('token_details_description') }}
      </div>
      <div class="paragraph-inter-12-regular whitespace-pre-line break-word">
        {{ description }}
      </div>
    </div>
  </div>
  <AppPlaceholderMultiline v-else />
</template>
