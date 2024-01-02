<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  isLoading?: boolean
  isEoa?: boolean
  isError?: boolean
  address?: Address
  name?: string
  profileUrl?: string | Base64EncodedImage
}

defineProps<Props>()
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center">
    <div
      class="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100"
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
      :profile-url="profileUrl"
      :profile-address="address"
      has-identicon
      class="mb-2"
    ></lukso-profile>
    <lukso-username v-if="name" :name="name" size="small"></lukso-username>
    <lukso-username
      v-else-if="address"
      :address="address"
      size="small"
      slice-by="4"
    ></lukso-username>
    <lukso-username v-else name="--" size="small" hide-prefix></lukso-username>
  </div>
</template>
