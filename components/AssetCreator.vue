<script setup lang="ts">
import { Creator } from '@/models/creator'
import { ProfileRepository } from '@/repositories/profile'

type Props = {
  creator?: Creator
}

const props = defineProps<Props>()
const profileRepo = useRepo(ProfileRepository)

const handleOpenCreator = (event: Event, creator?: Creator) => {
  try {
    event.stopPropagation()
    assertAddress(creator?.profile?.address)
    navigateTo(profileRoute(creator.profile.address))
  } catch (error) {
    console.error(error)
  }
}

const profile = computed(() => {
  return (
    props.creator?.profileId &&
    profileRepo.getProfileAndImages(props.creator.profileId)
  )
})
</script>

<template>
  <div
    v-if="profile?.address"
    class="cursor-pointer shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex bg-neutral-100 transition hover:scale-105"
    @click="event => handleOpenCreator(event, creator)"
  >
    <lukso-profile
      size="x-small"
      :profile-url="profile.profileImage?.base64"
    ></lukso-profile>
    <div class="pl-1">
      <div class="text-neutral-60 paragraph-inter-10-semi-bold">
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
