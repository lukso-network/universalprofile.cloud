<script setup lang="ts">
import type { Creator } from '@/models/creator'

type Props = {
  creators: Creator[]
}

defineProps<Props>()
</script>

<template>
  <div class="heading-inter-14-bold pb-2">
    {{ $formatMessage('asset_creators_title') }}
  </div>
  <div class="mb-8 flex flex-wrap gap-2">
    <div
      v-for="(creator, index) in creators"
      :key="index"
      class="inline-flex items-center rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3"
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
    </div>
  </div>
</template>
