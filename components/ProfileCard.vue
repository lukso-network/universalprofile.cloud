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
      class="mb-22"
    >
      <div slot="content" class="flex flex-col items-center">
        <div class="relative -bottom-[140px] text-center">
          <div class="group cursor-pointer flex flex-col items-center">
            <lukso-profile
              :profile-url="viewedProfile?.profileImage?.base64"
              :profile-address="viewedProfile?.address"
              size="x-large"
              has-identicon
              class="relative z-[1] flex outline outline-4 outline-neutral-100 rounded-full transition group-hover:scale-105"
              @click="handleCopyAddress"
            >
            </lukso-profile>
            <div
              class="relative -top-10 h-0 opacity-10 paragraph-ptmono-16-regular text-24 transition group-hover:opacity-30"
              @click="handleCopyAddress"
            >
              {{ viewedProfile?.address }}
            </div>
          </div>
          <lukso-username
            v-if="viewedProfile?.name"
            :name="viewedProfile?.name.toLowerCase()"
            :address="viewedProfile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
          ></lukso-username>
          <lukso-username
            v-else
            :name="$formatMessage('profile_default_name')"
            :address="viewedProfile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
            hide-prefix
          ></lukso-username>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
