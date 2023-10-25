<script setup lang="ts">
import { ProfileItem } from '@/models/profile'

const profileRepo = useRepo(ProfileModel)
const profile = ref<ProfileItem>()
const profileAddress = getCurrentProfileAddress()

watchEffect(() => {
  profile.value = profileRepo
    .with('backgroundImage')
    .with('profileImage')
    .find(profileAddress)
})

const handleCopyAddress = () => {
  try {
    assertAddress(profile.value?.address)
    navigator.clipboard.writeText(profile.value.address)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="profile?.backgroundImage?.base64"
      is-full-width
      custom-class="rounded-24 shadow-neutral-drop-shadow"
    >
      <div slot="content" class="flex flex-col items-center">
        <lukso-profile
          :profile-url="profile?.profileImage?.base64"
          :profile-address="profile?.address"
          class="mb-4"
          has-identicon
        >
        </lukso-profile>
        <lukso-username
          v-if="profile?.name"
          :name="profile?.name.toLowerCase()"
          size="large"
          address-color="neutral-100"
          max-width="350"
          :name-color="profile?.backgroundImage ? 'neutral-100' : ''"
        ></lukso-username>
        <lukso-username
          v-else
          :name="$formatMessage('profile_default_name')"
          size="large"
          address-color="neutral-100"
          max-width="350"
          :name-color="profile?.backgroundImage ? 'neutral-100' : ''"
          hide-prefix
        ></lukso-username>
        <lukso-username
          :address="profile?.address"
          size="small"
          slice-by="40"
          :address-color="
            profile?.backgroundImage ? 'neutral-100' : 'neutral-20'
          "
          class="cursor-pointer mt-2"
          @click="handleCopyAddress"
        ></lukso-username>
      </div>
    </lukso-card>
  </div>
</template>
