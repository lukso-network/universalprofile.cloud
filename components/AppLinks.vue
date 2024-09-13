<script setup lang="ts">
import { detectSocialMedia } from '@lukso/web-components/tools'

import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

type Props = {
  links?: LinkMetadata[]
}

type Slots = {
  default(props: {
    hasLinks: boolean
    socialMediaLinks: LinkMetadataSocialMedia[]
    otherLinks: LinkMetadataSocialMedia[]
    linksParsed: LinkMetadataSocialMedia[]
  }): any
}

const props = defineProps<Props>()
defineSlots<Slots>()

const linksParsed = computed(
  () =>
    props?.links
      ?.filter(link => link.url)
      ?.map(
        link =>
          ({
            ...link,
            socialMediaName: detectSocialMedia(link?.url),
          }) as LinkMetadataSocialMedia
      ) || []
)

const hasLinks = computed(() => !!linksParsed.value?.length)

const socialMediaLinks = computed(() =>
  linksParsed.value?.filter(link => !!link.socialMediaName)
)
const otherLinks = computed(() =>
  linksParsed.value?.filter(link => !link.socialMediaName)
)
</script>

<template>
  <slot
    :has-links="hasLinks"
    :social-media-links="socialMediaLinks"
    :other-links="otherLinks"
    :links-parsed="linksParsed"
  />
</template>
