<script setup lang="ts">
import type { ButtonSize } from '@lukso/web-components'

type Props = {
  asset?: Asset
  buttonSize?: ButtonSize
  withoutTitle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  asset: undefined,
  buttonSize: 'medium',
  withoutTitle: false,
})

const { formatMessage } = useIntl()
const isLoaded = computed(() => props.asset && !props.asset?.isMetadataLoading)
</script>

<template>
  <template v-if="isLoaded">
    <AppLinks :links="asset?.resolvedMetadata?.links">
      <template #default="{ socialMediaLinks, otherLinks, hasLinks }">
        <div v-if="hasLinks">
          <div v-if="!withoutTitle" class="heading-inter-14-bold pb-2">
            {{ formatMessage('asset_links_title') }}
          </div>
          <div class="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
            <div
              v-for="(link, index) in socialMediaLinks"
              :key="index"
              class="inline-flex"
            >
              <LinkButton :link="link" :size="buttonSize" />
            </div>
            <div
              v-for="(link, index) in otherLinks"
              :key="index"
              class="inline-flex"
            >
              <LinkButton :link="link" :size="buttonSize" />
            </div>
          </div>
        </div>
      </template>
    </AppLinks>
  </template>
  <AppPlaceholderSection v-else slot-class="flex gap-4">
    <AppPlaceholderLine
      :class="{
        'h-[48px] w-[170px]': buttonSize === 'medium',
        'h-[24px] w-[90px]': buttonSize === 'small',
      }"
    />
    <AppPlaceholderLine
      :class="{
        'h-[48px] w-[170px]': buttonSize === 'medium',
        'h-[24px] w-[90px]': buttonSize === 'small',
      }"
    />
  </AppPlaceholderSection>
</template>
