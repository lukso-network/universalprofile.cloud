<script setup lang="ts">
import { Creator } from '@/types/profile'

type Props = {
  creator?: Creator
}

defineProps<Props>()

const handleOpenCreator = (event: Event, creator?: Creator) => {
  try {
    event.stopPropagation()
    assertAddress(creator?.address)
    navigateTo(profileRoute(creator.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div
    v-if="creator"
    class="cursor-pointer shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex bg-neutral-100 transition hover:scale-105"
    @click="event => handleOpenCreator(event, creator)"
  >
    <lukso-profile
      size="x-small"
      :profile-url="creator.profileImage"
    ></lukso-profile>
    <div class="pl-1">
      <div class="text-neutral-60 paragraph-inter-10-semi-bold">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="creator.name"
        :address="creator.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
