<script setup lang="ts">
type LinkButtonSize = 'small' | 'medium'

type Props = {
  link?: LinkMetadataSocialMedia
  size?: LinkButtonSize
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
  link: undefined,
})
</script>

<template>
  <lukso-button
    v-if="link?.socialMediaName"
    :size="size"
    :href="link?.url"
    variant="text"
    is-link
    is-full-width
    is-icon
    custom-class="px-0"
  >
    <div class="flex w-full items-center px-1 text-left">
      <lukso-icon
        :name="`logo-${link?.socialMediaName}-mono`"
        :size="size"
      ></lukso-icon>
    </div>
  </lukso-button>
  <lukso-button
    v-else-if="link?.url"
    :size="size"
    :href="link.url"
    variant="secondary"
    is-link
    is-full-width
  >
    <div class="flex w-full items-center text-left">
      <lukso-icon name="link" :size="size" class="mr-2"></lukso-icon>
      <span
        :class="{
          'paragraph-inter-14-medium': size === 'medium',
        }"
      >
        {{ link?.title || link.url }}
      </span>
    </div>
  </lukso-button>
</template>
