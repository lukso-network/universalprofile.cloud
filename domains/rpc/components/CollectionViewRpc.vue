<script setup lang="ts">
type Props = {
  asset?: Asset | null
}

defineProps<Props>()

const { formatMessage } = useIntl()

const handleDataProviderSettings = () => {
  navigateTo(settingsDataProviderRoute())
}
</script>

<template>
  <div class="relative mx-auto grid max-w-content pb-28">
    <!-- Asset info -->
    <CollectionAssetCard :asset="asset" />

    <!-- RPC info -->
    <div
      class="paragraph-inter-12-regular flex items-center gap-3 rounded-8 bg-sky-85 p-4"
    >
      <lukso-icon name="information"></lukso-icon>
      <div>
        {{ formatMessage('collection_not_avail_front') }}
        <span
          class="paragraph-inter-12-semi-bold cursor-pointer underline"
          @click="handleDataProviderSettings"
          >{{ formatMessage('collection_not_avail_link') }}</span
        >
      </div>
    </div>
  </div>
</template>
