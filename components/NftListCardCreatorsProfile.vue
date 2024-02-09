<script setup lang="ts">
type Props = {
  profile: Profile
  hasName?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="flex h-6">
    <lukso-profile
      size="x-small"
      :profile-url="profile?.profileImage?.url"
      :profile-address="profile?.address"
      has-identicon
    ></lukso-profile>
    <div class="pl-1" v-if="hasName">
      <div class="paragraph-inter-10-semi-bold text-neutral-60">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="profile?.name"
        :address="profile?.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
