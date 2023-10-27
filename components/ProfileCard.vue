<script setup lang="ts">
const { viewedProfile } = useViewedProfile()

const handleCopyAddress = () => {
  try {
    assertAddress(viewedProfile.value?.address)
    navigator.clipboard.writeText(viewedProfile.value.address)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="viewedProfile?.backgroundImage?.base64"
      is-full-width
      custom-class="rounded-24 shadow-neutral-drop-shadow"
    >
      <div slot="content" class="flex flex-col items-center">
        <lukso-profile
          :profile-url="viewedProfile?.profileImage?.base64"
          :profile-address="viewedProfile?.address"
          class="mb-4"
          has-identicon
        >
        </lukso-profile>
        <lukso-username
          v-if="viewedProfile?.name"
          :name="viewedProfile?.name.toLowerCase()"
          size="large"
          address-color="neutral-100"
          max-width="350"
          :name-color="viewedProfile.backgroundImage ? 'neutral-100' : ''"
        ></lukso-username>
        <lukso-username
          v-else
          :name="$formatMessage('profile_default_name')"
          size="large"
          address-color="neutral-100"
          max-width="350"
          :name-color="viewedProfile?.backgroundImage ? 'neutral-100' : ''"
          hide-prefix
        ></lukso-username>
        <lukso-username
          :address="viewedProfile?.address"
          size="small"
          slice-by="40"
          :address-color="
            viewedProfile?.backgroundImage ? 'neutral-100' : 'neutral-20'
          "
          class="cursor-pointer mt-2"
          @click="handleCopyAddress"
        ></lukso-username>
      </div>
    </lukso-card>
  </div>
</template>
