<script setup lang="ts">
const { profile } = useProfileStore()
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="profile.backgroundImageUrl"
      is-full-width
      custom-class="rounded-24 shadow-neutral-drop-shadow"
    >
      <div slot="content" class="flex flex-col items-center">
        <lukso-profile
          :profile-url="profile.profileImageUrl"
          :profile-address="profile.address"
          class="mb-4"
        >
        </lukso-profile>
        <lukso-username
          v-if="profile.name"
          :name="profile.name"
          size="large"
          address-color="neutral-100"
          name-color="neutral-100"
        ></lukso-username>
        <lukso-username
          :address="profile.address"
          :size="profile.name ? 'small' : 'large'"
          slice-by="40"
          address-color="neutral-100"
          name-color="neutral-100"
        ></lukso-username>
      </div>
    </lukso-card>
  </div>
</template>
