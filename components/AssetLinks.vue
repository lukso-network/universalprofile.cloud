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
          <div class="flex flex-col gap-3">
            <ul v-if="socialMediaLinks.length > 0" class="flex flex-wrap gap-2">
              <li
                v-for="(link, index) in socialMediaLinks"
                :key="index"
                class="inline-flex"
              >
                <LinkButton :link="link" :size="buttonSize" />
              </li>
            </ul>
            <ul
              v-if="otherLinks.length > 0"
              class="flex flex-col flex-wrap gap-x-4 gap-y-2 sm:flex-row"
            >
              <li
                v-for="(link, index) in otherLinks"
                :key="index"
                class="inline-flex"
              >
                <LinkButton :link="link" :size="buttonSize" />
              </li>
            </ul>
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
