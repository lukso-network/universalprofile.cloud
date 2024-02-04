<script setup lang="ts">
import type { Creator } from '@/models/creator'

type Props = {
  creators: Creator[]
}

const props = defineProps<Props>()

const creatorsProfiles = computed(() =>
  props.creators.map(creator => {
    return { ...creator, profile: useProfile(creator?.profileId).profile.value }
  })
)

const handleOpenProfile = (address?: Address) => {
  if (address) {
    navigateTo(profileRoute(address))
    fetchAndStoreAssets(address)
  }
}
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('asset_creators_title') }}
  </div>
  <div class="mb-8 flex flex-wrap gap-2">
    <lukso-button
      v-for="(creator, index) in creatorsProfiles"
      :key="index"
      custom-class="px-4"
      variant="secondary"
      @click="handleOpenProfile(creator?.profile?.address)"
    >
      <lukso-profile
        size="x-small"
        :profile-url="creator?.profile?.profileImage?.url"
        :profile-address="creator?.profile?.address"
        has-identicon
      ></lukso-profile>
      <lukso-username
        :name="creator?.profile?.name"
        :address="creator?.profile?.address"
        size="small"
        class="pl-2"
        name-color="neutral-20"
      ></lukso-username>
      <lukso-tooltip
        v-if="creator?.isVerified"
        variant="success"
        :text="$formatMessage('asset_creators_verified')"
        class="ml-2"
      >
        <lukso-icon
          name="complete-filled"
          color="green-54"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
      <lukso-tooltip
        v-else
        variant="danger"
        :text="$formatMessage('asset_creators_unverified')"
        class="ml-2"
      >
        <lukso-icon
          name="cross-filled"
          color="red-55"
          secondary-color="neutral-100"
          size="small"
        ></lukso-icon>
      </lukso-tooltip>
    </lukso-button>
  </div>
</template>
