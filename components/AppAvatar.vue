<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  isLoading?: boolean
  isEoa?: boolean
  isError?: boolean
  address?: Address
  profile?: Profile | Receiver
}

defineProps<Props>()
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center">
    <div
      class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-2"
    >
      <lukso-icon name="progress-indicator" size="x-large"></lukso-icon>
    </div>
    <lukso-username name="--" size="small" hide-prefix></lukso-username>
  </div>
  <div v-else-if="isError" class="flex flex-col items-center">
    <lukso-profile size="large" class="mb-2"></lukso-profile>
    <lukso-username name="--" size="small" hide-prefix></lukso-username>
  </div>
  <div v-else-if="isEoa" class="flex flex-col items-center">
    <lukso-profile
      v-if="address"
      size="large"
      :profile-url="makeBlockie(address)"
      class="mb-2"
    ></lukso-profile>
    <lukso-username
      :address="address"
      size="small"
      slice-by="4"
    ></lukso-username>
  </div>
  <div v-else class="flex flex-col items-center">
    <lukso-profile
      size="large"
      :profile-url="profile?.profileImageUrl"
      :profile-address="profile?.address"
      has-identicon
      class="mb-2"
    ></lukso-profile>
    <lukso-username
      v-if="profile?.name"
      :name="profile.name"
      size="small"
    ></lukso-username>
    <lukso-username
      v-else-if="profile?.address"
      :address="profile?.address"
      size="small"
      slice-by="4"
    ></lukso-username>
    <lukso-username v-else name="--" size="small" hide-prefix></lukso-username>
  </div>
</template>
