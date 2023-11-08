<script setup lang="ts">
const { viewedProfile } = useViewedProfile()

const hasLinks = computed(
  () => viewedProfile.value?.links && viewedProfile.value.links?.length > 0
)
const hasDescription = computed(
  () =>
    viewedProfile.value?.description && viewedProfile.value.description !== ''
)
const hasTags = computed(
  () => viewedProfile.value?.tags && viewedProfile.value.tags?.length > 0
)
</script>

<template>
  <div v-if="hasDescription || hasLinks || hasTags" class="py-6 w-1/2 mx-auto">
    <ul
      v-if="hasTags"
      class="gap-x-4 gap-y-2 mb-3 flex justify-center flex-wrap"
    >
      <li
        v-for="(tag, index) in viewedProfile?.tags"
        :key="index"
        class="inline-flex"
      >
        <lukso-tag is-rounded>{{ tag }}</lukso-tag>
      </li>
    </ul>
    <div v-if="hasDescription" class="paragraph-inter-12-medium text-center">
      {{ viewedProfile?.description }}
    </div>
    <ul
      v-if="hasLinks"
      class="gap-x-4 gap-y-2 mt-3 flex justify-center flex-wrap"
    >
      <li
        v-for="(link, index) in viewedProfile?.links"
        :key="index"
        class="inline-flex"
      >
        <lukso-button
          size="small"
          :href="link.url"
          is-link
          variant="secondary"
          class="transition hover:opacity-70"
          >{{ link.title }}
          <lukso-icon name="link-3" size="small" class="ml-2"></lukso-icon>
        </lukso-button>
      </li>
    </ul>
  </div>
</template>
