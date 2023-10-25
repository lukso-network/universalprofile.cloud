<script setup lang="ts">
import { ProfileItem } from '@/models/profile'

const profileRepo = useRepo(ProfileModel)
const profile = ref<ProfileItem>()
const profileAddress = getCurrentProfileAddress()

watchEffect(() => {
  profile.value = profileRepo.find(profileAddress)
})

const hasLinks = computed(
  () => profile.value?.links && profile.value.links?.length > 0
)
const hasDescription = computed(
  () => profile.value?.description && profile.value.description !== ''
)
const hasTags = computed(
  () => profile.value?.tags && profile.value.tags?.length > 0
)
</script>

<template>
  <div v-if="hasDescription || hasLinks || hasTags" class="py-6 w-1/2 mx-auto">
    <ul
      v-if="hasTags"
      class="gap-x-4 gap-y-2 mb-3 flex justify-center flex-wrap"
    >
      <li
        v-for="(tag, index) in profile?.tags"
        :key="index"
        class="inline-flex"
      >
        <lukso-tag is-rounded>{{ tag }}</lukso-tag>
      </li>
    </ul>
    <div v-if="hasDescription" class="paragraph-inter-12-medium text-center">
      {{ profile?.description }}
    </div>
    <ul
      v-if="hasLinks"
      class="gap-x-4 gap-y-2 mt-3 flex justify-center flex-wrap"
    >
      <li
        v-for="(link, index) in profile?.links"
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
