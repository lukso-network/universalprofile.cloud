<script setup lang="ts">
import type { Creator } from '@/models/creator'

type Props = {
  creator?: Creator
}

const props = defineProps<Props>()
const { profile, profileImageUrl } = useProfile(props.creator?.profile?.address)

const handleOpenCreator = (event: Event, creator?: Creator) => {
  try {
    event.stopPropagation()
    assertAddress(creator?.profile?.address)
    navigateTo(profileRoute(creator.profile.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div
    v-if="profile?.address"
    class="inline-flex cursor-pointer rounded-4 bg-neutral-100 p-2 pr-6 shadow-neutral-drop-shadow transition hover:scale-105"
    @click="event => handleOpenCreator(event, creator)"
  >
    <lukso-profile
      size="x-small"
      :profile-url="profileImageUrl"
    ></lukso-profile>
    <div class="pl-1">
      <div class="paragraph-inter-10-semi-bold text-neutral-60">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="profile.name"
        :address="profile.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
