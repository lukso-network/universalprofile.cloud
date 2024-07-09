<script setup lang="ts">
const viewedProfile = useProfile().viewedProfile()
const { isMobile } = useDevice()

const hasLinks = computed(
  () => viewedProfile?.value?.links && viewedProfile.value.links?.length > 0
)
const hasDescription = computed(
  () =>
    viewedProfile?.value?.description && viewedProfile.value.description !== ''
)
const hasTags = computed(
  () => viewedProfile?.value?.tags && viewedProfile.value.tags?.length > 0
)
</script>

<template>
  <div
    v-if="hasDescription || hasLinks || hasTags"
    class="mx-auto py-6 sm:w-1/2"
  >
    <ul
      v-if="hasTags"
      class="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2"
    >
      <li
        v-for="(tag, index) in viewedProfile?.tags"
        :key="index"
        class="inline-flex"
      >
        <lukso-tag is-rounded>{{ tag }}</lukso-tag>
      </li>
    </ul>
    <div
      v-if="hasDescription"
      class="paragraph-inter-12-medium whitespace-pre-line text-center break-word"
    >
      {{ viewedProfile?.description }}
    </div>
    <AppLinks :links="viewedProfile?.links">
      <template #default="{ socialMediaLinks, otherLinks }">
        <ul
          v-if="socialMediaLinks"
          class="mt-4 flex flex-col flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-row"
        >
          <li
            v-for="(link, index) in socialMediaLinks"
            :key="index"
            class="inline-flex"
          >
            <LinkButton :link="link" :size="isMobile ? 'medium' : 'small'" />
          </li>
        </ul>
        <ul
          v-if="otherLinks"
          class="mt-4 flex flex-col flex-wrap justify-center gap-x-4 gap-y-2 sm:flex-row"
        >
          <li
            v-for="(link, index) in otherLinks"
            :key="index"
            class="inline-flex"
          >
            <LinkButton :link="link" :size="isMobile ? 'medium' : 'small'" />
          </li>
        </ul>
      </template>
    </AppLinks>
  </div>
</template>
